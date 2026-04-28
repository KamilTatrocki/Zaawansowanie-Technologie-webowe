/**
 * @typedef {import('./classes').Room} Room
 * @typedef {import('./classes').User} User
 */

/** @type {Map<string, Room>} */
const rooms = new Map();
/** @type {Map<string, User>} */
const users = new Map();
/** @type {Map<string, Set<string>>} */
const typingUsers = new Map();

const defaultRooms = [
  { id: "general", name: "# general", description: "General discussion for everyone" },
  { id: "tech", name: "# tech", description: "Technology & programming talk" },
  { id: "random", name: "# random", description: "Anything goes here" },
  { id: "gaming", name: "# gaming", description: "Video games & esports" },
];

const { Room } = require("./classes");

defaultRooms.forEach((r) => {
  const room = new Room(r.id, r.name, r.description, null);
  rooms.set(r.id, room);
  typingUsers.set(r.id, new Set());
});

module.exports = { rooms, users, typingUsers };
