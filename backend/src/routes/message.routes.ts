import express from "express";
import {
  sendMessage,
  getUserConversation,
  getContactsLatestMessages,
} from "../controllers/messages.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

//middleware
router.use(authMiddleware);

//send message
router
  .post("/sendMessage", sendMessage)
  .get("/conversation/:id", getUserConversation)
  .get("/messages", getContactsLatestMessages);

export default router;
