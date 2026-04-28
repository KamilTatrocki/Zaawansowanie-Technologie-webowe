const rooms = new Map();
const users = new Map();
const typingUsers = new Map();

const defaultRooms = [
  { id: "general", name: "# general", description: "General discussion for everyone" },
  { id: "tech", name: "# tech", description: "Technology & programming talk" },
  { id: "random", name: "# random", description: "Anything goes here" },
  { id: "gaming", name: "# gaming", description: "Video games & esports" },
];

defaultRooms.forEach((r) => {
  rooms.set(r.id, { ...r, createdAt: new Date().toISOString(), messages: [] });
  typingUsers.set(r.id, new Set());
});

module.exports = { rooms, users, typingUsers };
