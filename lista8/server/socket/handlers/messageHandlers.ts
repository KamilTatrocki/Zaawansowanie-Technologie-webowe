const userService = require("../../services/userService");
const roomService = require("../../services/roomService");
const messageService = require("../../services/messageService");
const typingService = require("../../services/typingService");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadsDir } = require("../../config/uploads");

export default function (io: any, socket: any) {
  socket.on("message:send", ({ roomId, text, image }, callback) => {
    const user = userService.getUser(socket.id);
    if (!user) return callback?.({ error: "Not authenticated" });
    if (!roomService.roomExists(roomId)) return callback?.({ error: "Room not found" });

    let imageUrl = null;
    if (image && image.buffer) {
      const allowed = /jpeg|jpg|png|gif|webp/;
      const ext = path.extname(image.name).toLowerCase();
      if (!allowed.test(ext) && !allowed.test(image.type)) {
        return callback?.({ error: "Only image files are allowed" });
      }

      const filename = `${uuidv4()}${ext || '.png'}`;
      const filepath = path.join(uploadsDir, filename);
      try {
        fs.writeFileSync(filepath, Buffer.from(image.buffer));
        imageUrl = `http://localhost:3001/uploads/${filename}`;
      } catch (err) {
        return callback?.({ error: "Failed to save image" });
      }
    }

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
