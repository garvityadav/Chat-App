////////////////////////////////////////
// sendMessage , getUserConversation
////////////////////////////////////////
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { StatusCodes } from "http-status-codes";
import {
  CustomRequest,
  IContact,
  IJsonResponse,
  IMessage,
  IUser,
} from "../interface/interface";
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
      throw new CustomError("Invalid user id", StatusCodes.BAD_REQUEST);
    }

    //check if the contact is in the contactList
    const checkContact = await prisma.contact.findFirst({
      where: { userId, contactId: receiverId },
    });
    if (!checkContact) {
      throw new CustomError(
        "User is not in contact List",
        StatusCodes.FORBIDDEN
      );
    }

    if (checkContact.isBlocked) {
      throw new CustomError(
        "Contact is no longer available",
        StatusCodes.FORBIDDEN
      );
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
        sender: { select: { id: true } },
        receiver: { select: { id: true } },
      },
    });
    const contact = await prisma.contact.findFirst({
      where: { userId, contactId },
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
      throw new CustomError("user not found", StatusCodes.BAD_REQUEST);
    }

    //grabbing messages
    const latestChats = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true } },
        receiver: { select: { id: true } },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contacts: true },
    });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }
    const contacts = user.contacts;

    const distinctContactMessage: any = [];
    const distinctContacts = new Set();
    latestChats.forEach((message) => {
      const contactId =
        message.senderId == userId ? message.receiverId : message.senderId;

      if (distinctContacts.has(contactId)) return;
      distinctContacts.add(contactId);

      const contact = contacts?.find((contact) => {
        return contact.contactId == contactId;
      });
      const isContact = contact ? true : false;
      const username = isContact
        ? contact?.username || "Fetching username..."
        : "Unknown";
      distinctContactMessage.push({
        contactId,
        id: message.id,
        content: message.content,
        username,
        read: message.read,
        createdAt: message.createdAt,
        isContact,
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
