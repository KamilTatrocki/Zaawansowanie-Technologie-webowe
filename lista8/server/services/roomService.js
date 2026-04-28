const store = require("../domain/store");
const { createRoom, createSystemMessage } = require("../domain/factories");

function getRoomList(io) {
  return Array.from(store.rooms.values()).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    createdAt: r.createdAt,
    memberCount: io.sockets.adapter.rooms.get(r.id)?.size || 0,
  }));
}

function getRoom(roomId) {
  return store.rooms.get(roomId);
}

function roomExists(roomId) {
  return store.rooms.has(roomId);
}

function getUsersInRoom(io, roomId) {
  const socketIds = io.sockets.adapter.rooms.get(roomId) || new Set();
  return Array.from(socketIds)
    .map((id) => store.users.get(id))
    .filter(Boolean)
    .map((u) => ({ id: u.id, nickname: u.nickname, avatar: u.avatar }));
}

function createNewRoom(id, name, description, createdBy) {
  const room = createRoom(id, name, description, createdBy);
  store.rooms.set(id, room);
  store.typingUsers.set(id, new Set());
  return room;
}

function addSystemMessage(roomId, text) {
  const msg = createSystemMessage(roomId, text);
  const room = store.rooms.get(roomId);
  if (room) room.messages.push(msg);
  return msg;
}

function addMessage(roomId, msg) {
  const room = store.rooms.get(roomId);
  if (room) room.messages.push(msg);
}

function getRecentMessages(roomId, limit = 100) {
  return store.rooms.get(roomId)?.messages.slice(-limit) || [];
}

module.exports = {
  getRoomList,
  getRoom,
  roomExists,
  getUsersInRoom,
  createNewRoom,
  addSystemMessage,
  addMessage,
  getRecentMessages,
};
