import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { IJsonResponse } from "../interface/interface";
import { CustomError } from "../error_middleware/error.middleware";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, senderID, receiverID } = req.body;
    //check if both user exist
    const sender = await prisma.user.findUnique({ where: { id: senderID } });
    const receiver = await prisma.user.findUnique({
      where: { id: receiverID },
    });
    if (!sender || !receiver) {
      throw new CustomError("user not found", StatusCodes.BAD_REQUEST);
    }
    const messageDoc = await prisma.message.create({
      data: { content: message, senderId: sender.id, receiverId: receiver.id },
    });
    const response: IJsonResponse = {
      status: StatusCodes.CREATED,
      message: "message saved",
      data: messageDoc,
    };
    res.status(response.status).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getUserWithMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    // if no user id
    if (!userId) {
      throw new CustomError("user id not found", StatusCodes.BAD_REQUEST);
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessage: true,
        receivedMessage: true,
      },
    });
    // if no user
    if (!user) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }

    const { receivedMessage, sentMessage } = user;
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "message displayed",
      data: { receivedMessage, sentMessage },
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};
