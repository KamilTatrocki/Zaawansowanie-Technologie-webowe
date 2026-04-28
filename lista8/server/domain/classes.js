const { v4: uuidv4 } = require("uuid");

class User {
  constructor(socketId, nickname, avatar) {
    this.id = socketId;
    this.nickname = nickname;
    this.avatar = avatar;
    this.currentRoom = null;
  }
}

class Room {
  constructor(id, name, description, createdBy) {
    this.id = id;
    this.name = name.startsWith("# ") ? name : `# ${name}`;
    this.description = description || "";
    this.createdAt = new Date().toISOString();
    this.messages = [];
    this.createdBy = createdBy;
  }
}

class Message {
  constructor({ type, text, imageUrl, roomId, sender }) {
    this.id = uuidv4();
    this.type = type;
    this.text = text?.trim() || "";
    this.imageUrl = imageUrl || null;
    this.roomId = roomId;
    this.sender = sender;
    this.timestamp = new Date().toISOString();
  }
}

class SystemMessage {
  constructor(roomId, text) {
    this.id = uuidv4();
    this.type = "system";
    this.text = text;
    this.roomId = roomId;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = { User, Room, Message, SystemMessage };
