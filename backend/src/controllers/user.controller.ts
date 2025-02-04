import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import {
  CustomRequest,
  IContact,
  IJsonResponse,
  IUser,
} from "../interface/interface";
import { StatusCodes } from "http-status-codes";
import { savePassword, verifyPassword } from "../utils/passHash";
import { CustomError } from "../error_middleware/error.middleware";
import { includes } from "lodash";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError("user id not found", StatusCodes.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { username: true },
    });
    if (!user) {
      throw new CustomError("No user found", StatusCodes.NOT_FOUND);
    }
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user found",
      data: {
        _id: user?.id,
        email: user?.email,
        username: user?.username.fullName,
      },
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
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }
    //check if the old password is correct
    const passwordIsVerified = verifyPassword(oldPassword, user.password);
    if (!passwordIsVerified) {
      throw new CustomError("password is incorrect", StatusCodes.UNAUTHORIZED);
    }
    await prisma.user.update({
      where: { id: userId },
      data: { username },
    });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user updated",
    };
    res.status(StatusCodes.OK).json(response);
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
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as CustomRequest).user.userId.toString();
    const { contactId, username, isBlocked, isUnfriend, favorite } = req.body;
    if (!contactId) {
      throw new CustomError(
        "Please provide contact id",
        StatusCodes.BAD_REQUEST
      );
    }
    const contact = await prisma.contact.findFirst({
      where: { contactId, userId },
    });
    if (!contact) {
      throw new CustomError("contact not found!", StatusCodes.NOT_FOUND);
    }
    const update = {
      username: username ? username : contact.username,
      isBlocked: isBlocked ? isBlocked : contact.isBlocked,
      isUnfriend: isUnfriend ? isUnfriend : contact.isUnfriend,
      favorite: favorite ? favorite : contact.favorite,
    };
    await prisma.contact.update({ where: { id: contact.id }, data: update });
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "contact updated",
    };
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;

    if (!userId) {
      throw new CustomError("Unauthorize access", StatusCodes.UNAUTHORIZED);
    }
    const { contactId } = req.query;
    const contactList = await prisma.contact.findMany({
      where: { userId, isBlocked: false, isUnfriend: false },
    });
    if (!contactList)
      throw new CustomError(
        "can't fetch user contact list",
        StatusCodes.NOT_FOUND
      );

    const contact = contactList.filter((contact) => {
      return contact.contactId == contactId;
    });
    if (contact.length == 0) {
      throw new CustomError("no contact found!", StatusCodes.NOT_FOUND);
    }
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "contact list created",
      data: contactId ? contact[0] : contactList,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const addContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError(
        "Please provide userId or user not logged in properly",
        StatusCodes.FORBIDDEN
      );
    }
    const contactId = req.query.contactId?.toString();
    if (!contactId) {
      throw new CustomError(
        "Please Provide contact id",
        StatusCodes.BAD_REQUEST
      );
    }
    const contact = await prisma.user.findUnique({
      where: { id: contactId },
      include: { username: true },
    });
    if (!contact) {
      throw new CustomError(
        "No user found with id :" + contactId,
        StatusCodes.NOT_FOUND
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contacts: true },
    });

    if (!user) {
      throw new CustomError(
        "No user with id: " + userId,
        StatusCodes.NOT_FOUND
      );
    }

    // check if the contact is not already added ?
    const contacts = user?.contacts;
    const isFriend = contacts?.some((contact) => {
      contact.id == contact.contactId;
    });
    if (isFriend) {
      throw new CustomError(
        "Already added in contact list!",
        StatusCodes.CONFLICT
      );
    }
    const newContact = await prisma.contact.create({
      data: {
        userId: userId,
        contactId,
        username: contact.username.username,
      },
    });
    const response: IJsonResponse = {
      status: StatusCodes.CREATED,
      message: "contact created",
      data: {
        contactId: newContact.id,
      },
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError("Unauthorize", StatusCodes.UNAUTHORIZED);
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { username: true, contacts: true, friendRequests: true },
    });
    if (!user) {
      throw new CustomError(
        "logged in user not found",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    const { username, hashTag } = req.query;
    if (!username && !hashTag) {
      throw new CustomError("Please provide username", StatusCodes.BAD_REQUEST);
    }
    const fullName = `${username}#${hashTag}`;
    console.log(`FULLNAME = ${fullName}`);
    const userFound = await prisma.username.findFirst({
      where: { fullName },
    });
    if (!userFound) {
      throw new CustomError(
        `No user with username : ${fullName} found`,
        StatusCodes.NOT_FOUND
      );
    }
    if (userFound.userId == userId) {
      throw new CustomError(
        "Can't search your own Id",
        StatusCodes.BAD_REQUEST
      );
    }
    const response: IJsonResponse = {
      message: "user found",
      status: StatusCodes.OK,
      data: {
        id: userFound.userId,
        username: userFound.username,
        requestSend: user.friendRequests.some((friendRequestDoc) => {
          return userFound.userId == friendRequestDoc.contactId;
        }),
        isContact: user.contacts.some((contact) => {
          return userFound.userId == contact.contactId;
        }),
      },
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const addFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    if (!userId) {
      throw new CustomError(
        "Please provide userId or user not logged in properly",
        StatusCodes.FORBIDDEN
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contacts: true, friendRequests: true },
    });

    if (!user) {
      throw new CustomError(
        "No user with id: " + userId,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    const contactId = req.query.contactId?.toString();
    if (!contactId) {
      throw new CustomError(
        "Please Provide contact id",
        StatusCodes.BAD_REQUEST
      );
    }
    const contact = await prisma.user.findUnique({
      where: { id: contactId },
      include: { username: true },
    });
    if (!contact) {
      throw new CustomError(
        "No user found with id :" + contactId,
        StatusCodes.NOT_FOUND
      );
    }

    // check if the contact is not already added ?
    const contacts = user?.contacts;
    const isFriend = contacts?.some((contact) => {
      contact.id == contact.contactId;
    });
    if (isFriend) {
      throw new CustomError(
        "Already added in contact list!",
        StatusCodes.CONFLICT
      );
    }

    const data = {
      userId,
      contactId,
    };
    const friendRequest = await prisma.friendRequest.create({ data });

    const response: IJsonResponse = {
      status: StatusCodes.CREATED,
      message: "Friend request sent",
      data: friendRequest,
    };
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};
