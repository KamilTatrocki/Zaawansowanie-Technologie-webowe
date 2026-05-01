import { Message } from "../domain/classes";

function buildMessage({ text, imageUrl, roomId, sender }) {
  return new Message({
    type: imageUrl ? "image" : "text",
    text,
    imageUrl,
    roomId,
    sender,
  });
}

export { buildMessage };
