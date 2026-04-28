const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 10e6, // 10MB for image uploads
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve uploaded images statically
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// Image upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ─── In-memory state ──────────────────────────────────────────────────────────
const rooms = new Map(); // roomId → { id, name, description, createdAt, messages[] }
const users = new Map(); // socketId → { id, nickname, avatar, currentRoom }
const typingUsers = new Map(); // roomId → Set<nickname>

// Pre-seed default rooms
const defaultRooms = [
  { id: "general", name: "# general", description: "General discussion for everyone" },
  { id: "tech", name: "# tech", description: "Technology & programming talk" },
  { id: "random", name: "# random", description: "Anything goes here" },
  { id: "gaming", name: "# gaming", description: "Video games & esports" },
];

defaultRooms.forEach((r) => {
  rooms.set(r.id, { ...r, createdAt: new Date().toISOString(), messages: [] });
  typingUsers.set(r.id, new Set());
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getRoomList() {
  return Array.from(rooms.values()).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    createdAt: r.createdAt,
    memberCount: io.sockets.adapter.rooms.get(r.id)?.size || 0,
  }));
}

function getUsersInRoom(roomId) {
  const socketIds = io.sockets.adapter.rooms.get(roomId) || new Set();
  return Array.from(socketIds)
    .map((id) => users.get(id))
    .filter(Boolean)
    .map((u) => ({ id: u.id, nickname: u.nickname, avatar: u.avatar }));
}

function systemMessage(roomId, text) {
  const msg = {
    id: uuidv4(),
    type: "system",
    text,
    roomId,
    timestamp: new Date().toISOString(),
  };
  const room = rooms.get(roomId);
  if (room) room.messages.push(msg);
  return msg;
}

// ─── Socket.IO events ────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ── Join as user (login) ──────────────────────────────────────────────────
  socket.on("user:join", ({ nickname, avatar }, callback) => {
    // Validate nickname uniqueness
    const taken = Array.from(users.values()).some(
      (u) => u.nickname.toLowerCase() === nickname.trim().toLowerCase()
    );
    if (taken) {
      return callback({ error: "Nickname already taken. Please choose another." });
    }

    const user = {
      id: socket.id,
      nickname: nickname.trim(),
      avatar: avatar || generateAvatar(nickname.trim()),
      currentRoom: null,
    };
    users.set(socket.id, user);

    callback({
      success: true,
      user,
      rooms: getRoomList(),
    });

    console.log(`User joined: ${nickname}`);
  });

  // ── Join room ─────────────────────────────────────────────────────────────
  socket.on("room:join", (roomId, callback) => {
    const user = users.get(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });

    const room = rooms.get(roomId);
    if (!room) return callback?.({ error: "Room not found" });

    // Leave previous room
    if (user.currentRoom && user.currentRoom !== roomId) {
      leaveRoom(socket, user, user.currentRoom);
    }

    socket.join(roomId);
    user.currentRoom = roomId;

    // Send recent history (last 100 messages)
    const history = room.messages.slice(-100);

    callback?.({
      success: true,
      room: { ...room, messages: history },
      members: getUsersInRoom(roomId),
    });

    // Notify others
    const msg = systemMessage(roomId, `${user.nickname} joined the room`);
    socket.to(roomId).emit("message:new", msg);
    io.to(roomId).emit("room:members", getUsersInRoom(roomId));
    io.emit("rooms:update", getRoomList());

    console.log(`${user.nickname} joined room: ${room.name}`);
  });

  // ── Leave room ────────────────────────────────────────────────────────────
  socket.on("room:leave", (roomId, callback) => {
    const user = users.get(socket.id);
    if (!user) return;
    leaveRoom(socket, user, roomId);
    callback?.({ success: true });
  });

  // ── Send message ──────────────────────────────────────────────────────────
  socket.on("message:send", ({ roomId, text, imageUrl }, callback) => {
    const user = users.get(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });
    if (!rooms.has(roomId)) return callback?.({ error: "Room not found" });

    const msg = {
      id: uuidv4(),
      type: imageUrl ? "image" : "text",
      text: text?.trim() || "",
      imageUrl: imageUrl || null,
      roomId,
      sender: { id: user.id, nickname: user.nickname, avatar: user.avatar },
      timestamp: new Date().toISOString(),
    };

    rooms.get(roomId).messages.push(msg);

    // Stop typing for this user
    stopTyping(socket, roomId, user.nickname);

    io.to(roomId).emit("message:new", msg);
    callback?.({ success: true, message: msg });
  });

  // ── Typing indicators ─────────────────────────────────────────────────────
  socket.on("typing:start", (roomId) => {
    const user = users.get(socket.id);
    if (!user || !rooms.has(roomId)) return;
    const typingSet = typingUsers.get(roomId) || new Set();
    typingSet.add(user.nickname);
    typingUsers.set(roomId, typingSet);
    socket.to(roomId).emit("typing:update", Array.from(typingSet));
  });

  socket.on("typing:stop", (roomId) => {
    const user = users.get(socket.id);
    if (!user) return;
    stopTyping(socket, roomId, user.nickname);
  });

  // ── Create room ───────────────────────────────────────────────────────────
  socket.on("room:create", ({ name, description }, callback) => {
    const user = users.get(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (rooms.has(id)) return callback?.({ error: "Room already exists" });

    const room = {
      id,
      name: `# ${name}`,
      description: description || "",
      createdAt: new Date().toISOString(),
      messages: [],
      createdBy: user.nickname,
    };
    rooms.set(id, room);
    typingUsers.set(id, new Set());

    io.emit("rooms:update", getRoomList());
    callback?.({ success: true, room });
    console.log(`Room created: ${room.name} by ${user.nickname}`);
  });

  // ── Disconnect ────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      if (user.currentRoom) {
        leaveRoom(socket, user, user.currentRoom);
      }
      users.delete(socket.id);
      console.log(`User disconnected: ${user.nickname}`);
    }
    io.emit("rooms:update", getRoomList());
  });

  // ─────────────────────────────────────────────────────────────────────────
  function leaveRoom(socket, user, roomId) {
    socket.leave(roomId);
    if (user.currentRoom === roomId) user.currentRoom = null;

    // Remove from typing
    stopTyping(socket, roomId, user.nickname);

    const msg = systemMessage(roomId, `${user.nickname} left the room`);
    io.to(roomId).emit("message:new", msg);
    io.to(roomId).emit("room:members", getUsersInRoom(roomId));
    io.emit("rooms:update", getRoomList());
  }

  function stopTyping(socket, roomId, nickname) {
    const typingSet = typingUsers.get(roomId);
    if (typingSet) {
      typingSet.delete(nickname);
      socket.to(roomId).emit("typing:update", Array.from(typingSet));
    }
  }
});

// ─── Generate avatar color from nickname ────────────────────────────────────
function generateAvatar(nickname) {
  const colors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
    "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#a855f7",
  ];
  const idx = nickname.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[idx % colors.length];
}

// ─── Start server ─────────────────────────────────────────────────────────
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Chat server running at http://localhost:${PORT}`);
  console.log(`   Accepting WebSocket connections from http://localhost:5173\n`);
});
