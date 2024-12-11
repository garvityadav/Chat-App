import express, { Request, Response } from "express";
import prisma from "../config/prisma";
import {
  sendMessage,
  getUserWithMessages,
} from "../controllers/messages.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

//send message
router.use(authMiddleware);
router.post("/sendMessage", (req: Request, res: Response) => {
  sendMessage(req, res);
});
router.get("/getUserMessages/:userId", (req: Request, res: Response) => {
  getUserWithMessages(req, res);
});

export default router;
