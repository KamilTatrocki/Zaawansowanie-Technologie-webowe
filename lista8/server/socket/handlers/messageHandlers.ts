import * as userService from "../../services/userService";
import * as roomService from "../../services/roomService";
import * as messageService from "../../services/messageService";
import * as typingService from "../../services/typingService";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { uploadsDir } from "../../config/uploads";

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
