// In-memory state — single source of truth
const rooms = new Map();      // roomId → Room object
const users = new Map();      // socketId → User object
const typingUsers = new Map(); // roomId → Set<nickname>

// Pre-seed default rooms
const defaultRooms = [
  { id: "general", name: "# general", description: "General discussion for everyone" },
  { id: "tech",    name: "# tech",    description: "Technology & programming talk" },
  { id: "random",  name: "# random",  description: "Anything goes here" },
  { id: "gaming",  name: "# gaming",  description: "Video games & esports" },
];

defaultRooms.forEach((r) => {
  rooms.set(r.id, { ...r, createdAt: new Date().toISOString(), messages: [] });
  typingUsers.set(r.id, new Set());
});

module.exports = { rooms, users, typingUsers };
