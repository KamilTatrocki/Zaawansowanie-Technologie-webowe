const userService = require("../../services/userService");
const roomService = require("../../services/roomService");
const messageService = require("../../services/messageService");
const typingService = require("../../services/typingService");

module.exports = function (io, socket) {
  socket.on("message:send", ({ roomId, text, imageUrl }, callback) => {
    const user = userService.getUser(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });
    if (!roomService.roomExists(roomId)) return callback?.({ error: "Room not found" });

    const msg = messageService.buildMessage({
      text,
      imageUrl,
      roomId,
      sender: { id: user.id, nickname: user.nickname, avatar: user.avatar },
    });

    roomService.addMessage(roomId, msg);

    // Stop typing for this user
    const typingUsers = typingService.stopTyping(roomId, user.nickname);
    socket.to(roomId).emit("typing:update", typingUsers);

    io.to(roomId).emit("message:new", msg);
    callback?.({ success: true, message: msg });
  });
};
