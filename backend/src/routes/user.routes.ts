import { Router } from "express";
import {
  getUser,
  getUserContacts,
  updateUser,
  toggleUserStatus,
  addContact,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();
router.use(authMiddleware);
router
  .get("/", getUser)
  .get("/contacts", getUserContacts)
  .get("/status", toggleUserStatus)
  .post("/update", updateUser)
  .post("/add-contact", addContact);

export default router;
