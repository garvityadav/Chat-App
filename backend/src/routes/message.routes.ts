import express from "express";
import {
  sendMessage,
  getUserConversation,
} from "../controllers/messages.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

//middleware
router.use(authMiddleware);

//send message
router.post("/sendMessage", sendMessage);
router.get("/conversation/:id", getUserConversation);

export default router;
