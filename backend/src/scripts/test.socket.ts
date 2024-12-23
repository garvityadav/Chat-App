import { Server } from "socket.io";

const io = new Server(3030, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  socket.emit("message", "Welcome to Socket.IO!");

  socket.on("message", (data) => {
    console.log("Message received:", data);
  });
});
