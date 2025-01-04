///////////////////////////////////////////
// this controller will have all the user related logic
// getUser, updateUser, toggleUserStatus
///////////////////////////////////////////

import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { CustomRequest, IJsonResponse } from "../interface/interface";
import { StatusCodes } from "http-status-codes";
import { savePassword, verifyPassword } from "../utils/passHash";
import { CustomError } from "../error_middleware/error.middleware";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      const response: IJsonResponse = {
        status: StatusCodes.NOT_FOUND,
        message: "user not found",
        errors: [{ field: "userId", details: "user not found" }],
      };

      res.status(StatusCodes.NOT_FOUND).json(response);
    }
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user found",
      data: { _id: user?.id, email: user?.email, username: user?.username },
    };
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    const { username } = req.body;
    const oldPassword = req.body.password;
    const newPassword = req.body.newPassword;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }
    //check if the old password is correct
    const passwordIsVerified = verifyPassword(oldPassword, user.password);
    if (!passwordIsVerified) {
      throw new CustomError("password is incorrect", StatusCodes.BAD_REQUEST);
    }
    //hasing the new password
    const hashedPassword = await savePassword(newPassword);
    //update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, password: hashedPassword },
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user updated",
    };
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user status updated",
    };
  } catch (error) {
    next(error);
  }
};
