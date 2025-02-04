import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  checkUser,
  getUsers,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router
  .get("/logout", authMiddleware, logout)
  .get("/get-users", getUsers)
  .get("/check-user", checkUser)
  .post("/register", registerUser)
  .post("/login", loginUser);

export default router;
