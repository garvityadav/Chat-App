import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import cookieParser from "cookie-parser";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/api/status", (req, res) => {
  res.json({ message: "server is running" });
});

//mount the auth
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messaging", messageRoutes);
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
