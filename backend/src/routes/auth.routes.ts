import express, { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logout,
  checkUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", authMiddleware, logout);
router.post("/check-user", checkUser);

export default router;
