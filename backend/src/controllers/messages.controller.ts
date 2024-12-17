import { Request, Response } from "express";
import { savePassword, verifyPassword } from "../utils/passHash";
import prisma from "../config/prisma";
import { StatusCodes } from "http-status-codes";

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message, senderID, receiverID } = req.body;
    //check if both user exist
    const sender = await prisma.user.findUnique({ where: { id: senderID } });
    const receiver = await prisma.user.findUnique({
      where: { id: receiverID },
    });
    if (!sender || !receiver) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "user not found" });
      return;
    }
    const messageDoc = await prisma.message.create({
      data: { content: message, senderId: sender.id, receiverId: receiver.id },
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "message saved", messageDoc });
    return;
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "internal server error",
    });
  }
};

export const getUserWithMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    console.log(req.params);
    // if no user id
    if (!userId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "user id not found" });
      return;
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
      res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" });
      return;
    }

    const { receivedMessage, sentMessage } = user;

    res.status(StatusCodes.OK).json({
      message: "message displayed",
      receivedMessage,
      sentMessage,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
    throw new Error("internal server error");
  }
};
