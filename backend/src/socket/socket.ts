import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import { logger } from "../utils/logger";

interface IData {
  senderId: string;
  receiverId: string;
  message: string;
  error: boolean;
  createdAt: number;
}

interface ITyping {
  senderId: string;
  receiverId: string;
}

export const initializeSocket = (httpServer: HttpServer): Server => {
  const allowedOrigins = [
    process.env.FRONTEND_URL?.toString(),
    process.env.POSTMAN_URL?.toString(),
  ];

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.filter(
        (origin): origin is string => origin !== undefined
      ),
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // saving the socket id(s) for the current user session
  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    const timestamp = new Date().toUTCString();
    console.log(`${timestamp} User connected: ${socket.id}`);

    socket.on("register_user", (data) => {
      const { userId } = data;
      if (!userId) {
        socket.emit("user_registered", { success: false });
        return;
      }
      console.log(`THIS IS USER ID : ${userId}`);
      userSocketMap.set(userId, socket.id); // Map userId to socket id
      console.log(
        `${userId} is mapped with socket id ${userSocketMap.get(userId)}`
      );
      console.log(userSocketMap);
      socket.emit("user_registered", { success: true, userId });
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
        const { receiverId, senderId, error } = data;
        const receiverSocketId = userSocketMap.get(receiverId);
        const senderSocketId = userSocketMap.get(senderId);
        if (error == false) {
          if (receiverSocketId) {
            io.timeout(5000).to(receiverSocketId).emit("receive_message", data);
          } else {
            console.log(`User ${receiverId} is not connected`);
          }
          if (senderSocketId) {
            io.timeout(5000).to(senderSocketId).emit("receive_message", data);
          } else {
            console.log(`User ${senderId} is not connected`);
          }
        } else if (error) {
          if (senderSocketId) {
            io.timeout(5000).to(senderSocketId).emit("receive_message", data);
          } else {
            console.log(`User ${senderId} is not connected`);
          }
        }
      } catch (error) {
        console.error("Error in sending message Data \n", error);
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
