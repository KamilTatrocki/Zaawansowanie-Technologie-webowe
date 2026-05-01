import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { uploadsDir } from "./config/multer";
import uploadRoutes from "./routes/uploadRoutes";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/upload", uploadRoutes);

export default app;
