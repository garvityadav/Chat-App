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
    const { content: message, receiverId } = req.body;
    if (!message) {
      throw new CustomError(
        "Please provide message! Message cannot be blank.",
        StatusCodes.BAD_REQUEST
      );
    }
    if (!receiverId) {
      throw new CustomError("Invalid receiver id", StatusCodes.BAD_REQUEST);
    }
    const { userId } = (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError(
        "Missing login credential",
        StatusCodes.UNAUTHORIZED
      );
    }
    let isContact = false;
    //check if the contact is in the contactList
    const isContactBlocked = await prisma.blockedUser.findFirst({
      where: { userId, blockedUserId: receiverId },
    });
    if (isContactBlocked) {
      throw new CustomError("receiver is blocked", StatusCodes.FORBIDDEN);
    }

    const messageDoc = await prisma.message.create({
      data: { content: message, senderId: userId, receiverId },
    });
    const response: IJsonResponse = {
      status: StatusCodes.CREATED,
      message: "message saved",
      data: messageDoc,
    };
    res.status(response.status).json(response);
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
    const receiverId = req.params.id;

    const { userId } = (req as CustomRequest).user;

    // if no user id
    if (!receiverId) {
      throw new CustomError(
        "requested user id not found",
        StatusCodes.BAD_REQUEST
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "messages found",
      meta: {
        count: messages.length,
      },
      data: { messages },
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
      throw new CustomError(
        "can't access logged in user's id",
        StatusCodes.UNAUTHORIZED
      );
    }

    //grabbing messages
    const latestChats = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { username: { select: { username: true } } } },
        receiver: { select: { username: { select: { username: true } } } },
      },
    });

    const distinctContactMessage: any = [];
    const distinctContacts = new Set();
    latestChats.forEach((message) => {
      const contactId =
        message.senderId == userId ? message.receiverId : message.senderId;
      const username =
        message.senderId == userId
          ? message.receiver.username.username
          : message.sender.username.username;
      if (distinctContacts.has(contactId)) return;
      distinctContacts.add(contactId);

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
