import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useGlobalContext } from "./GlobalContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const URL =
  import.meta.env.VITE_NODE_ENV === "production" ? undefined : backendUrl;

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useGlobalContext();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const socketIo = io(URL, {
      autoConnect: false,
      withCredentials: true,
    });
    console.log(userId);
    if (userId) {
      socketIo.connect();
      socketIo.emit("register_user", { userId });
    }
    socketIo.on("user_registered", (data) => {
      console.log(`user registered: ${data}`);
      console.log(`socket connected to id : ${socketIo.id}`);
    });
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
      socketIo.off();
    };
  }, [userId]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
