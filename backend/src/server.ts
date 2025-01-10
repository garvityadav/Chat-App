import express from "express";
import dotenv from "dotenv";
import { createServer } from "node:http";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket/socket";
import cors from "cors";
import { errorMiddleware } from "./error_middleware/error.middleware";
import { gracefullyShutdown } from "./config/prisma";
import { pinoHttpLogger } from "./utils/logger";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// create HTTP server
const server = createServer(app);
const allowedOrigins = [
  process.env.FRONTEND_URL?.toString(),
  process.env.POSTMAN_URL?.toString(),
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(pinoHttpLogger);
// initialize socket io server
initializeSocket(server);

app.get("/api/status", (req, res) => {
  res.json({ message: "server is running" });
});

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messaging", messageRoutes);
app.use("/api/v1/user", userRoutes);
app.use(errorMiddleware);

process.on("SIGINT", () => {
  gracefullyShutdown("SIGINT");
}); // handle ctrl+c
process.on("SIGTERM", () => {
  gracefullyShutdown("SIGTERM");
}); // handle kill
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
