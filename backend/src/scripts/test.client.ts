import { io } from "socket.io-client";

const socket = io("http://localhost:3030", {
  withCredentials: true,
  transports: ["websocket"],
});

//handle connection

socket.on("connect", () => {
  logger.info("connect to server with ID", socket.id);
});

//emit message on the server
socket.emit("message", { content: "Hello from client" });

socket.on("disconnect", () => {
  logger.info("disconnected from the server");
});
