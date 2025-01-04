////////////////////////////////////////
// sendMessage , getUserConversation
////////////////////////////////////////
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { CustomRequest, IJsonResponse } from "../interface/interface";
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

export const getUserConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const otherUserId = req.params.id;

    const { userId } = (req as CustomRequest).user;

    // if no user id
    if (!otherUserId) {
      throw new CustomError("user id not found", StatusCodes.BAD_REQUEST);
    }
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
    });
    // if no user
    if (!otherUser) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
    });

    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "messages found",
      data: messages,
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};
