import express from "express";
import dotenv from "dotenv";
import http from "http";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket/socket";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// create HTTP server
const httpServer = http.createServer(app);

// initialize socket io server
initializeSocket(httpServer);

app.get("/api/status", (req, res) => {
  res.json({ message: "server is running" });
});

//mount the auth
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messaging", messageRoutes);
httpServer.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
