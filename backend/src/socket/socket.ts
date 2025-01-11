import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import { logger } from "../utils/logger";

interface IData {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: number;
}

interface ITyping {
  senderId: string;
  receiverId: string;
}

export const initializeSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // saving the socket id(s) for the current user session
  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    const timestamp = new Date().toISOString();
    logger.info(`${timestamp} User connected: ${socket.id}`);

    socket.on("register_user", (userId: string) => {
      userSocketMap.set(userId, socket.id); // Map userId to socket id
      console.log(
        `${userId} is mapped with socket id ${userSocketMap.get(userId)}`
      );
    });

    //typing event
    socket.on("user_typing", (data: ITyping) => {
      try {
        const { senderId, receiverId } = data;
        console.log(`${senderId} is typing to ${receiverId}`);
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.timeout(5000).to(receiverSocketId).emit("contact_typing", data);
        } else {
          console.log(`User ${receiverId} is not connected`);
        }
      } catch (error) {
        console.error("Error handling typing event", error);
      }
    });

    //receive and send message event
    socket.on("send_message", async (data: IData) => {
      try {
        const { senderId, receiverId, message } = data;
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.timeout(5000).to(receiverSocketId).emit("send_message", data);
        } else {
          console.log(`User ${receiverId} is not connected`);
        }
      } catch (error) {
        console.error(error);
      }
    });
    socket.on("disconnect", () => {
      for (const [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(userId);
          console.log(`user socket id deleted=> ${userId}:${id}`);
        }
      }
      const timestamp = new Date().toISOString();
      logger.info(`${timestamp} User disconnect: ${socket.id}`);
    });
  });
  return io;
};

//define events
