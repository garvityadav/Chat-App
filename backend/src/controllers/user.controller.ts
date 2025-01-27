///////////////////////////////////////////
// this controller will have all the user related logic
// getUser, updateUser, toggleUserStatus,getUserContacts
///////////////////////////////////////////

import { Request, Response, NextFunction, response } from "express";
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
    //hashing the new password
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
      throw new CustomError("contact not found!", StatusCodes.BAD_REQUEST);
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
        StatusCodes.BAD_REQUEST
      );

    const contact = contactList.filter((contact) => {
      return contact.contactId == contactId;
    });
    if (contact.length == 0) {
      throw new CustomError("no contact found!", StatusCodes.BAD_REQUEST);
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
    const contact: IContact = req.body;
    if (!contact) {
      throw new CustomError("Please provide contact", StatusCodes.BAD_REQUEST);
    }
    const contactExist = await prisma.user.findUnique({
      where: { id: contact.contactId },
    });
    const { userId } = (req as CustomRequest).user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contacts: true },
    });
    if (!user && !contactExist)
      throw new CustomError(
        "No user or contact found",
        StatusCodes.BAD_REQUEST
      );
    // check if the contact is not already added ?
    const contacts = user?.contacts;
    const isFriend = contacts?.filter((contact) => {
      contact.id == contact.contactId;
    });
    if (isFriend) {
      throw new CustomError(
        "Already added in contact list!",
        StatusCodes.BAD_REQUEST
      );
    }
    const newContact = await prisma.contact.create({
      data: {
        userId: userId,
        contactId: contact.contactId,
        username: contact.username ? contact.username : contact.contactId,
        favorite: contact.favorite ? contact.favorite : false,
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
