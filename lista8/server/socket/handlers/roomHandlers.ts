const userService = require("../../services/userService");
const roomService = require("../../services/roomService");
const typingService = require("../../services/typingService");

module.exports = function (io, socket) {
  function leaveRoom(user, roomId) {
    socket.leave(roomId);
    if (user.currentRoom === roomId) user.currentRoom = null;

    // Remove from typing
    const typingUsers = typingService.stopTyping(roomId, user.nickname);
    socket.to(roomId).emit("typing:update", typingUsers);

    const msg = roomService.addSystemMessage(roomId, `${user.nickname} left the room`);
    io.to(roomId).emit("message:new", msg);
    io.to(roomId).emit("room:members", roomService.getUsersInRoom(io, roomId));
    io.emit("rooms:update", roomService.getRoomList(io));
  }

  socket.on("room:join", (roomId, callback) => {
    const user = userService.getUser(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });

    if (!roomService.roomExists(roomId)) return callback?.({ error: "Room not found" });

    // Leave previous room
    if (user.currentRoom && user.currentRoom !== roomId) {
      leaveRoom(user, user.currentRoom);
    }

    socket.join(roomId);
    user.currentRoom = roomId;

    const room = roomService.getRoom(roomId);
    const history = roomService.getRecentMessages(roomId);

    callback?.({
      success: true,
      room: { ...room, messages: history },
      members: roomService.getUsersInRoom(io, roomId),
    });

    const msg = roomService.addSystemMessage(roomId, `${user.nickname} joined the room`);
    socket.to(roomId).emit("message:new", msg);
    io.to(roomId).emit("room:members", roomService.getUsersInRoom(io, roomId));
    io.emit("rooms:update", roomService.getRoomList(io));

    console.log(`${user.nickname} joined room: ${room.name}`);
  });

  socket.on("room:leave", (roomId, callback) => {
    const user = userService.getUser(socket.id);
    if (!user) return;
    leaveRoom(user, roomId);
    callback?.({ success: true });
  });

  socket.on("room:create", ({ name, description }, callback) => {
    const user = userService.getUser(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (roomService.roomExists(id)) return callback?.({ error: "Room already exists" });

    const room = roomService.createNewRoom(id, name, description, user.nickname);

    io.emit("rooms:update", roomService.getRoomList(io));
    callback?.({ success: true, room });
    console.log(`Room created: ${room.name} by ${user.nickname}`);
  });

  return { leaveRoom }; // Export for disconnect handler
};
