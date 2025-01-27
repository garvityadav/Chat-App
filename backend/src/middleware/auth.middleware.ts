import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/auth.token";
import { CustomRequest } from "../interface/interface";
import { CustomError } from "../error_middleware/error.middleware";

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const cookies = {
      access_cookie: req.cookies.access_token,
      refresh_cookie: req.cookies.refresh_token,
    };
    // if(cookies.access_cookie.exp())
    console.log("COOKIES ON SERVER : ", cookies);
    if (!cookies.access_cookie || !cookies.refresh_cookie) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorize access",
      });
      return;
    }

    const decode = verifyToken(
      cookies.access_cookie,
      cookies.refresh_cookie,
      res
    );
    if (!decode.userId) {
      throw new CustomError(
        "Token error, Please login again",
        StatusCodes.FORBIDDEN
      );
    }
    (req as CustomRequest).user = decode;
    console.log("Called auth", decode);
    next();
  } catch (error) {
    next(error);
  }
};
