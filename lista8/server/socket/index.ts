import * as userService from "../services/userService";
import * as roomService from "../services/roomService";

import registerUserHandlers from "./handlers/userHandlers";
import registerRoomHandlers from "./handlers/roomHandlers";
import registerMessageHandlers from "./handlers/messageHandlers";
import registerTypingHandlers from "./handlers/typingHandlers";

export default function (io: any) {
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
