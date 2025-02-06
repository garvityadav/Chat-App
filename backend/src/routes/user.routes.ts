import { Router } from "express";
import {
  getUser,
  getUserContacts,
  updateUser,
  toggleUserStatus,
  addContact,
  updateContact,
  searchUser,
  sendFriendRequest,
  getFriendRequests,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();
router.use(authMiddleware);
router
  .get("/", getUser)
  .get("/contacts/", getUserContacts)
  .get("/status", toggleUserStatus)
  .get("/add-contact", addContact)
  .post("/update", updateUser)
  .post("/contact/update", updateContact)
  .get("/search-user/", searchUser)
  .get("/send-friend-request/", sendFriendRequest)
  .get("/friend-requests", getFriendRequests);

export default router;
