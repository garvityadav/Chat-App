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
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      throw new CustomError("No user found", StatusCodes.NOT_FOUND);
    }
    const username = await prisma.username.findUnique({
      where: { id: user.usernameId },
    });

    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "user found",
      data: {
        _id: user?.id,
        email: user?.email,
        username,
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
    const { username, hashTag, password: oldPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }
    //check if the old password is correct
    if (oldPassword) {
      const passwordIsVerified = await verifyPassword(
        oldPassword,
        user.password
      );
      if (!passwordIsVerified) {
        throw new CustomError(
          "password is incorrect",
          StatusCodes.UNAUTHORIZED
        );
      }
    }
    if (username && hashTag) {
      const checkFullNameExist = await prisma.username.findUnique({
        where: { fullName: `${username}#${hashTag}`, isDeleted: false },
      });
      if (checkFullNameExist) {
        throw new CustomError("Username already taken", StatusCodes.CONFLICT);
      }
      const [deleteUsername, newFullName] = await prisma.$transaction([
        prisma.username.update({
          where: { id: user.usernameId, isDeleted: false },
          data: { isDeleted: true },
        }),
        prisma.username.create({
          data: {
            userId,
            username,
            hashTag,
            fullName: `${username}#${hashTag}`,
          },
        }),
      ]);
      user.usernameId = newFullName.id;
    }

    await prisma.user.update({
      where: { id: userId, isDeleted: false },
      data: { usernameId: user.usernameId },
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
    if (!userId) {
      throw new CustomError(
        "No logged in user id found",
        StatusCodes.UNAUTHORIZED
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      throw new CustomError("user not found", StatusCodes.NOT_FOUND);
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId, isDeleted: false },
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
    const { contactId, username, favorite } = req.body;
    if (!contactId) {
      throw new CustomError(
        "Please provide contact id",
        StatusCodes.BAD_REQUEST
      );
    }
    const contact = await prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId }, isDeleted: false },
    });
    if (!contact) {
      throw new CustomError("contact not found!", StatusCodes.NOT_FOUND);
    }
    const update = {
      username: username ? username : contact.username,
      favorite: favorite ? favorite : contact.favorite,
    };
    await prisma.contact.update({
      where: { id: contact.id, isDeleted: false },
      data: update,
    });
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
      where: { userId, isDeleted: false },
    });
    if (!contactList)
      throw new CustomError(
        "can't fetch user contact list",
        StatusCodes.NOT_FOUND
      );
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: "contact list created",
      data: contactList,
    };
    if (contactId) {
      const contact = contactList.filter((contact) => {
        return contact.contactId == contactId;
      });
      if (contact.length == 0) {
        throw new CustomError("no contact found!", StatusCodes.NOT_FOUND);
      }
      response.data = contact;
    }
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
    const checkFriendRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: contactId, receiverId: userId },
        isDeleted: false,
        accepted: false,
      },
      include: {
        Sender: { select: { usernameId: true } },
      },
    });
    if (!checkFriendRequest) {
      throw new CustomError(
        "No request found , Ask the contact to send a friend request",
        StatusCodes.NOT_FOUND
      );
    }

    //check if user don't already exists
    const contactExist = await prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId }, isDeleted: false },
    });

    if (contactExist) {
      throw new CustomError("User already in contact", StatusCodes.CONFLICT);
    }
    const senderUsername = await prisma.username.findUnique({
      where: { id: checkFriendRequest.Sender.usernameId },
      select: { username: true },
    });
    if (!senderUsername) {
      throw new CustomError("can't fetch username", StatusCodes.NOT_FOUND);
    }
    const [addContact, deleteFriendRequest] = await prisma.$transaction([
      prisma.contact.create({
        data: {
          userId,
          contactId,
          username: senderUsername.username,
        },
      }),
      prisma.friendRequest.update({
        where: {
          id: checkFriendRequest.id,
        },
        data: { accepted: true, isDeleted: true },
      }),
    ]);

    const response: IJsonResponse = {
      status: StatusCodes.CREATED,
      message: "contact created",
      data: { id: addContact.id },
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
    const { username, hashTag } = req.query;
    if (!userId) {
      throw new CustomError("Unauthorize", StatusCodes.UNAUTHORIZED);
    }

    if (!username && !hashTag) {
      throw new CustomError("Please provide username", StatusCodes.BAD_REQUEST);
    }
    const fullName = `${username}#${hashTag}`;
    const reqUser = await prisma.username.findFirst({
      where: { fullName },
    });
    if (!reqUser) {
      throw new CustomError(
        `No user with username : ${fullName} found`,
        StatusCodes.NOT_FOUND
      );
    }
    if (reqUser.userId == userId) {
      throw new CustomError(
        "Can't search your own Id",
        StatusCodes.BAD_REQUEST
      );
    }
    const isContact = await prisma.contact.findUnique({
      where: {
        userId_contactId: { userId: userId!, contactId: reqUser.userId! },
        isDeleted: false,
      },
    });
    const response: IJsonResponse = {
      message: "user found",
      status: StatusCodes.OK,
      data: {
        id: reqUser.id,
        requestUserId: userId,
        fullName: reqUser.fullName,
        isContact: isContact ? true : false,
      },
    };

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};

export const sendFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    const contactId = req.query.contactId?.toString();
    if (!userId) {
      throw new CustomError(
        "Please provide userId or user not logged in properly",
        StatusCodes.FORBIDDEN
      );
    }
    if (!contactId) {
      throw new CustomError(
        "Please Provide contact id",
        StatusCodes.BAD_REQUEST
      );
    }
    const checkFriendRequests = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: userId, receiverId: contactId },
        isDeleted: false,
      },
      include: { Sender: true, Receiver: true },
    });

    if (checkFriendRequests) {
      throw new CustomError(
        "Friend request already sent",
        StatusCodes.CONFLICT
      );
    }
    const data = {
      senderId: userId,
      receiverId: contactId,
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

export const getFriendRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = (req as CustomRequest).user;
    const { received, sent } = req.query;
    if (!received && !sent) {
      throw new CustomError(
        "Please send proper query",
        StatusCodes.BAD_REQUEST
      );
    }
    if (!userId) {
      throw new CustomError(
        "Please provide userId or user not logged in properly",
        StatusCodes.FORBIDDEN
      );
    }
    const response: IJsonResponse = {
      status: StatusCodes.OK,
      message: `Friend Request ${
        received ? "received list created" : "sent list created"
      } `,
      data: null,
    };
    if (received) {
      const friendRequestsReceived = await prisma.friendRequest.findMany({
        where: { receiverId: userId, isDeleted: false, accepted: false },
        include: {
          Sender: { select: { username: { select: { fullName: true } } } },
        },
      });
      if (!friendRequestsReceived) {
        throw new CustomError(
          "Error occurred while retrieving data",
          StatusCodes.NOT_FOUND
        );
      }
      response.data = friendRequestsReceived;
    }
    if (sent) {
      const friendRequestsSent = await prisma.friendRequest.findMany({
        where: { senderId: userId, isDeleted: false, accepted: false },
        include: {
          Receiver: {
            select: {
              username: { select: { fullName: true } },
            },
          },
        },
      });
      if (!friendRequestsSent) {
        throw new CustomError(
          "Error occurred while retrieving data",
          StatusCodes.NOT_FOUND
        );
      }
      response.data = friendRequestsSent;
    }
    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
};
