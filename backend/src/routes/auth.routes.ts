import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  registerUser(req, res);
});
router.post("/login", (req: Request, res: Response) => {
  loginUser(req, res);
});

export default router;
