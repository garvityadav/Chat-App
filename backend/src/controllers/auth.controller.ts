import { Request, RequestHandler, Response } from "express";
import { savePassword, verifyPassword } from "../utils/passHash";
import prisma from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { createToken, ITokens } from "../utils/auth.token";

const jwtAccessExpireTime = process.env.JWT_ACCESS_EXPIRE_TIME || "15m";

const registerUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    //check if the user already exists :
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await savePassword(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });
    res.status(StatusCodes.CREATED).json({
      message: "new user registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "error registering user",
    });
  }
};

const loginUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    //find the user in db
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No user found",
      });
      return;
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token: ITokens = await createToken({ id: user.id });
    if (!token) {
      throw new Error("token not found");
    }
    //set cookie
    res.cookie("access_token", token.accessToken, {
      httpOnly: true, //Prevents Javascript access
      secure: process.env.NODE_ENV === "production", //HTTPS only in production
      sameSite: "strict",
      maxAge: 15 * 60 * 60 * 1000, //15 min
    });

    res.cookie("refresh_token", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 60 * 60 * 60 * 1000, //7days
    });
    res.status(StatusCodes.OK).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("error logging in", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "internal server error. Please try again later",
    });
  }
};

export const logout: RequestHandler = (req: Request, res: Response): void => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(StatusCodes.OK).json({
      message: "user logged out!",
    });
  } catch (error) {}
};

export { registerUser, loginUser };
