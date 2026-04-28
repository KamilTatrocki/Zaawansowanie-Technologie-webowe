const { Message } = require("../domain/classes");

function buildMessage({ text, imageUrl, roomId, sender }) {
  return new Message({
    type: imageUrl ? "image" : "text",
    text,
    imageUrl,
    roomId,
    sender,
  });
}

module.exports = { buildMessage };
