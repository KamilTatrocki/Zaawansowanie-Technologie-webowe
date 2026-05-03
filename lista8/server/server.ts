import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { corsOptions } from "./config/cors";
import initSockets from "./socket";

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
