import express from "express";
import dotenv from "dotenv";
import http from "http";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./socket/socket";
import cors from "cors";
import { errorMiddleware } from "./error_middleware/error.middleware";
import { gracefullyShutdown } from "./config/prisma";
import { logger, pinoHttpLogger } from "./utils/logger";
import { pinoHttp } from "pino-http";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// create HTTP server
const httpServer = http.createServer(app);

app.use(
  cors({ origin: process.env.FRONTEND_URL?.toString(), credentials: true })
);

app.use(express.json());
app.use(cookieParser());

app.use(pinoHttpLogger);
// initialize socket io server
initializeSocket(httpServer);

app.get("/api/status", (req, res) => {
  res.json({ message: "server is running" });
});

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messaging", messageRoutes);
app.use(errorMiddleware);

process.on("SIGINT", () => {
  gracefullyShutdown("SIGINT");
}); // handle ctrl+c
process.on("SIGTERM", () => {
  gracefullyShutdown("SIGTERM");
}); // handle kill
httpServer.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
