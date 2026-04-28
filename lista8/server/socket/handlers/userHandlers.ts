const userService = require("../../services/userService");
const roomService = require("../../services/roomService");

module.exports = function (io, socket) {
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
