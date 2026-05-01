import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { uploadsDir } from "./config/uploads";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static(uploadsDir));



export default app;
