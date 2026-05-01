const userService = require("../../services/userService");
const roomService = require("../../services/roomService");
const typingService = require("../../services/typingService");

export default function (io: any, socket: any) {
  socket.on("typing:start", (roomId) => {
    const user = userService.getUser(socket.id);
    if (!user || !roomService.roomExists(roomId)) return;
    const typingUsers = typingService.startTyping(roomId, user.nickname);
    socket.to(roomId).emit("typing:update", typingUsers);
  });

  socket.on("typing:stop", (roomId) => {
    const user = userService.getUser(socket.id);
    if (!user) return;
    const typingUsers = typingService.stopTyping(roomId, user.nickname);
    socket.to(roomId).emit("typing:update", typingUsers);
  });
};
