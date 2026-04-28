const { v4: uuidv4 } = require("uuid");

function createUser(socketId, nickname, avatar) {
  return { id: socketId, nickname, avatar, currentRoom: null };
}

function createRoom(id, name, description, createdBy) {
  return {
    id,
    name: `# ${name}`,
    description: description || "",
    createdAt: new Date().toISOString(),
    messages: [],
    createdBy,
  };
}

function createMessage({ type, text, imageUrl, roomId, sender }) {
  return {
    id: uuidv4(),
    type,
    text: text?.trim() || "",
    imageUrl: imageUrl || null,
    roomId,
    sender,
    timestamp: new Date().toISOString(),
  };
}

function createSystemMessage(roomId, text) {
  return {
    id: uuidv4(),
    type: "system",
    text,
    roomId,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { createUser, createRoom, createMessage, createSystemMessage };
