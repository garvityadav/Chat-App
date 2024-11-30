import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({ message: "server is running" });
});

//mount the auth
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
