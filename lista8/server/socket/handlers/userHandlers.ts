import * as userService from "../../services/userService";
import * as roomService from "../../services/roomService";

export default function (io: any, socket: any) {
  socket.on("user:join", ({ nickname, avatar }, callback) => {
    if (userService.isNicknameTaken(nickname)) {
      return callback({ error: "Nickname already taken. Please choose another." });
    }

    const user = userService.registerUser(socket.id, nickname, avatar);

    callback({
      success: true,
      user,
      rooms: roomService.getRoomList(io),
    });

    console.log(`User joined: ${nickname}`);
  });
};
