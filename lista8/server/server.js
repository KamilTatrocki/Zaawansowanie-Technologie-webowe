const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { corsOptions } = require("./config/cors");
const initSockets = require("./socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
  maxHttpBufferSize: 10e6, // 10MB for image uploads
});

// Initialize Socket.IO logic
initSockets(io);

// ─── Start server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Chat server running at http://localhost:${PORT}`);
  console.log(`   Accepting WebSocket connections from any localhost port\n`);
});
