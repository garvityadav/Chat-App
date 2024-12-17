import express, { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logout,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

export default router;
