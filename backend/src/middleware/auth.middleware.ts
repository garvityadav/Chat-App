import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/auth.token";
import { CustomRequest } from "../interface/middleware.interface";

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Authorization header missing or invalid",
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    const decode = verifyToken(token);
    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "invalid or expired token" });
  }
};
