import { Room, User } from './classes';

const rooms = new Map<string, Room>();
const users = new Map<string, User>();
const typingUsers = new Map<string, Set<string>>();

const defaultRooms = [
  { id: "general", name: "# general", description: "General discussion for everyone" },
  { id: "tech", name: "# tech", description: "Technology & programming talk" },
  { id: "random", name: "# random", description: "Anything goes here" },
  { id: "gaming", name: "# gaming", description: "Video games & esports" },
];

defaultRooms.forEach((r) => {
  const room = new Room(r.id, r.name, r.description, "");
  rooms.set(r.id, room);
  typingUsers.set(r.id, new Set());
});

module.exports = { rooms, users, typingUsers };
