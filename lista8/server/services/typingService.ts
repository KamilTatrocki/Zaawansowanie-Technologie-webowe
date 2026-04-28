const store = require("../domain/store");

function startTyping(roomId, nickname) {
  const typingSet = store.typingUsers.get(roomId) || new Set();
  typingSet.add(nickname);
  store.typingUsers.set(roomId, typingSet);
  return Array.from(typingSet);
}

function stopTyping(roomId, nickname) {
  const typingSet = store.typingUsers.get(roomId);
  if (typingSet) {
    typingSet.delete(nickname);
    return Array.from(typingSet);
  }
  return [];
}

module.exports = { startTyping, stopTyping };
