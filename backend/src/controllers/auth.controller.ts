import { Request, Response } from "express";
import { savePassword, verifyPassword } from "../utils/passHash";
import prisma from "../config/prisma";
import StatusCode, { StatusCodes } from "http-status-codes";

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, username, password } = req.body;
    console.log(email, username, password);
    //check if the user already exists :
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log(existingUser);
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
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
    return res.status(StatusCode.CREATED).json({
      message: "new user registered successfully",
      user,
    });
  } catch (error) {
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "error registering user",
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    //find the user in db
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({
        message: "No user found",
      });
    }

    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    return res.status(StatusCode.OK).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("error logging in", error);
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      message: "internal server error. Please try again later",
    });
  }
};

export { registerUser, loginUser };
