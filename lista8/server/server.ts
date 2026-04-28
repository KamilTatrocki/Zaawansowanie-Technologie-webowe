const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { corsOptions } = require("./config/cors");
const initSockets = require("./socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
  maxHttpBufferSize: 10e6, // 10MB (image )
});

initSockets(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
