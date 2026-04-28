const store = require("../domain/store");
const { createUser } = require("../domain/factories");

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#a855f7",
];

function generateAvatarColor(nickname) {
  const idx = nickname.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function isNicknameTaken(nickname) {
  return Array.from(store.users.values()).some(
    (u) => u.nickname.toLowerCase() === nickname.trim().toLowerCase()
  );
}

function registerUser(socketId, nickname, avatar) {
  const user = createUser(
    socketId,
    nickname.trim(),
    avatar || generateAvatarColor(nickname.trim())
  );
  store.users.set(socketId, user);
  return user;
}

function getUser(socketId) {
  return store.users.get(socketId);
}

function removeUser(socketId) {
  store.users.delete(socketId);
}

module.exports = { isNicknameTaken, registerUser, getUser, removeUser };
