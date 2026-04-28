const { v4: uuidv4 } = require("uuid");

export class User {
  id: string;
  nickname: string;
  avatar: string;
  currentRoom: string | null;

  constructor(socketId: string, nickname: string, avatar: string) {
    this.id = socketId;
    this.nickname = nickname;
    this.avatar = avatar;
    this.currentRoom = null;
  }
}

export class Room {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  messages: any[];
  createdBy: string;

  constructor(id: string, name: string, description: string, createdBy: string) {
    this.id = id;
    this.name = name.startsWith("# ") ? name : `# ${name}`;
    this.description = description || "";
    this.createdAt = new Date().toISOString();
    this.messages = [];
    this.createdBy = createdBy;
  }
}

export class Message {
  id: string;
  type: string;
  text: string;
  imageUrl: string | null;
  roomId: string;
  sender: any;
  timestamp: string;

  constructor({ type, text, imageUrl, roomId, sender }: any) {
    this.id = uuidv4();
    this.type = type;
    this.text = text?.trim() || "";
    this.imageUrl = imageUrl || null;
    this.roomId = roomId;
    this.sender = sender;
    this.timestamp = new Date().toISOString();
  }
}

export class SystemMessage {
  id: string;
  type: string;
  text: string;
  roomId: string;
  timestamp: string;

  constructor(roomId: string, text: string) {
    this.id = uuidv4();
    this.type = "system";
    this.text = text;
    this.roomId = roomId;
    this.timestamp = new Date().toISOString();
  }
}

