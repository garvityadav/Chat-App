//////////////////////////////////////
// registerUser , loginUser, checkUser, logout
//////////////////////////////////////
import {
  NextFunction,
  Request,
  RequestHandler,
  response,
  Response,
} from "express";
import { savePassword, verifyPassword } from "../utils/passHash";
import { prisma } from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { createToken, ITokens } from "../utils/auth.token";
import { logger } from "../utils/logger";
import { CustomRequest, IJsonResponse } from "../interface/interface";
import { CustomError } from "../error_middleware/error.middleware";

// const accessCookieExpireTime = process.env.ACCESS_COOKIE_EXPIRE_TIME
//   ? parseInt(process.env.ACCESS_COOKIE_EXPIRE_TIME, 10)
//   : 15 * 60 * 1000;
// const refreshCookieExpireTime = process.env.REFRESH_COOKIE_EXPIRE_TIME
//   ? parseInt(process.env.REFRESH_COOKIE_EXPIRE_TIME, 10)
//   : 24 * 60 * 60 * 1000;

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    //check if the user already exists :
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new CustomError("Email already exists", StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await savePassword(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });

    // generate token
    const token: ITokens = await createToken({ userId: user.id });
    if (!token) {
      logger.error("token not found");
      throw new CustomError(
        "Token not found",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    //set cookie
    res.cookie("access_token", token.accessToken, {
      httpOnly: true, //Prevents Javascript access
      secure: process.env.NODE_ENV === "production", //HTTPS only in production
      sameSite: "strict",
    });

    res.cookie("refresh_token", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const response: IJsonResponse = {
      status: StatusCodes.CREATED,
      message: "new user registered successfully",
      data: { userId: user.id },
    };

    res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    //find the user in db
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new CustomError("Invalid password", StatusCodes.UNAUTHORIZED);
    }

    // generate token
    const token: ITokens = await createToken({ userId: user.id });
    if (!token) {
      logger.error("token not found");
      throw new CustomError(
        "Token not found",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    //set cookie
    res.cookie("access_token", token.accessToken, {
      httpOnly: true, //Prevents Javascript access
      secure: process.env.NODE_ENV?.toString() === "production", //HTTPS only in production
      sameSite: "strict",
    });

    res.cookie("refresh_token", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV?.toString() === "production",
      sameSite: "strict",
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "Login successful",
      data: { userId: user.id },
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
    return;
  }
};

export const logout: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { userId } = (req as CustomRequest).user;
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user logged out!",
      data: { userId },
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info("Checking user");
    const { email } = req.body;
    if (!email) {
      throw new CustomError("Email not found", StatusCodes.BAD_REQUEST);
    }
    const checkEmail = await prisma.user.findUnique({ where: { email } });
    if (!checkEmail) {
      logger.info("Email not found");
      throw new CustomError("Email not found", StatusCodes.NOT_FOUND);
    }
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "User found",
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userLists = await prisma.user.findMany({});
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "List generated",
      data: userLists,
      meta: { count: userLists.length },
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};
