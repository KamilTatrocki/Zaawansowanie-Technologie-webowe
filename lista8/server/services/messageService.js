const { createMessage } = require("../domain/factories");

function buildMessage({ text, imageUrl, roomId, sender }) {
  return createMessage({
    type: imageUrl ? "image" : "text",
    text,
    imageUrl,
    roomId,
    sender,
  });
}

module.exports = { buildMessage };
