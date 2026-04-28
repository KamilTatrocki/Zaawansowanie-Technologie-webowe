const userService = require("../services/userService");
const roomService = require("../services/roomService");

const registerUserHandlers = require("./handlers/userHandlers");
const registerRoomHandlers = require("./handlers/roomHandlers");
const registerMessageHandlers = require("./handlers/messageHandlers");
const registerTypingHandlers = require("./handlers/typingHandlers");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    registerUserHandlers(io, socket);
    const { leaveRoom } = registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTypingHandlers(io, socket);

    socket.on("disconnect", () => {
      const user = userService.getUser(socket.id);
      if (user) {
        if (user.currentRoom) {
          leaveRoom(user, user.currentRoom);
        }
        userService.removeUser(socket.id);
        console.log(`User disconnected: ${user.nickname}`);
      }
      io.emit("rooms:update", roomService.getRoomList(io));
    });
  });
};
