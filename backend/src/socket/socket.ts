import { Server } from "socket.io";
import http from "http";

export const initializeSocket = (httpServer: http.Server): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true, //enable cookies
    },
  });

  io.on("connection", (socket) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} User connected: ${socket.id}`);

    socket.on("message", (data) => {
      try {
        console.log("Message received", data);
        socket.broadcast.emit("message", data);
      } catch (error) {
        console.error("Error handling message event", error);
      }
    });
    socket.on("disconnect", () => {
      const timestamp = new Date().toISOString();
      console.log(`${timestamp} User disconnect: ${socket.id}`);
    });
  });
  return io;
};

//define events
