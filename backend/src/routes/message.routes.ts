import express, { Request, Response } from "express";
import {
  sendMessage,
  getUserWithMessages,
} from "../controllers/messages.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

//middleware
router.use(authMiddleware);

//send message
router.post("/sendMessage", sendMessage);
router.get("/getUserMessages/:userId", getUserWithMessages);

export default router;
