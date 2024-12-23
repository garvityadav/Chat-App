import { io } from "socket.io-client";

const socket = io("http://localhost:3030", {
  withCredentials: true,
  transports: ["websocket"],
});

//handle connection

socket.on("connect", () => {
  console.log("connect to server with ID", socket.id);
});

//emit message on the server
socket.emit("message", { content: "Hello from client" });

socket.on("disconnect", () => {
  console.log("disconnected from the server");
});
