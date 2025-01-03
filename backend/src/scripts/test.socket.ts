import { Server } from "socket.io";

const io = new Server(3030, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  logger.info("Connected:", socket.id);
  socket.emit("message", "Welcome to Socket.IO!");

  socket.on("message", (data) => {
    logger.info("Message received:", data);
  });
});
