import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/auth.token";
import { CustomRequest } from "../interface/middleware.interface";

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken || !refreshToken) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorize access",
      });
      return;
    }
    const decode = verifyToken(accessToken, refreshToken, res);

    (req as CustomRequest).user = decode;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "invalid or expired token" });
  }
};
