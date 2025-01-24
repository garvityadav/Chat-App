////////////////////////////////////////
// sendMessage , getUserConversation
////////////////////////////////////////
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import { CustomRequest, IJsonResponse, IMessage } from "../interface/interface";
import { CustomError } from "../error_middleware/error.middleware";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, receiverID } = req.body;
    const { userId } = await (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError("Invalid user id", StatusCodes.BAD_REQUEST);
    }
    //check if both user exist
    const sender = await prisma.user.findUnique({ where: { id: userId } });
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
    const contactId = req.params.id;

    const { userId } = (req as CustomRequest).user;

    // if no user id
    if (!contactId) {
      throw new CustomError("user id not found", StatusCodes.BAD_REQUEST);
    }
    const otherUser = await prisma.user.findUnique({
      where: { id: contactId },
    });
    // if no user
    if (!otherUser) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
    });

    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "messages found",
      meta: {
        count: messages.length,
      },
      data: messages,
    };
    res.status(StatusCodes.OK).json(response);
    return;
  } catch (error) {
    next(error);
  }
};

export const getContactsLatestMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError("user not found", StatusCodes.BAD_REQUEST);
    }

    const latestChats: IMessage[] = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
    });
    const distinctContactMessage: any = [];
    const distinctContacts = new Set();

    latestChats.forEach((message) => {
      const contactId =
        message.senderId == userId ? message.receiverId : message.senderId;

      if (distinctContacts.has(contactId)) return;
      distinctContacts.add(contactId);
      const username =
        contactId == message.sender.id
          ? message.sender.username
          : message.receiver.username;
      distinctContactMessage.push({
        contactId,
        id: message.id,
        content: message.content,
        username,
        read: message.read,
        createdAt: message.createdAt,
      });
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "List created",
      data: distinctContactMessage,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};
