import { NextFunction, Request, RequestHandler, Response } from "express";
import { savePassword, verifyPassword } from "../utils/passHash";
import { prisma } from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { createToken, ITokens } from "../utils/auth.token";
import { logger } from "../utils/logger";
import { IJsonResponse } from "../interface/interface";
import { CustomError } from "../error_middleware/error.middleware";

const registerUser: RequestHandler = async (
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
    const token: ITokens = await createToken({ id: user.id });
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
      maxAge: parseInt(
        process.env.JWT_ACCESS_EXPIRE_TIME || `${15 * 60 * 1000}`
      ), //15 min
    });

    res.cookie("refresh_token", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(
        process.env.JWT_REFRESH_EXPIRE_TIME || `${24 * 60 * 60 * 1000}`
      ), //1 day
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

const loginUser: RequestHandler = async (
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
    const token: ITokens = await createToken({ id: user.id });
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
      maxAge: parseInt(
        process.env.JWT_ACCESS_EXPIRE_TIME || `${15 * 60 * 1000}`
      ), //15 min
    });

    res.cookie("refresh_token", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(
        process.env.JWT_REFRESH_EXPIRE_TIME || `${24 * 60 * 60 * 1000}`
      ), //1 day
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "Login successful",
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
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

const checkUser = async (
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
export { registerUser, loginUser, checkUser };
