// this controller will have all the user related logic

import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { CustomRequest, IJsonResponse } from "../interface/interface";
import { StatusCodes } from "http-status-codes";

export const getUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.user;
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
