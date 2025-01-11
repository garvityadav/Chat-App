import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? undefined
    : "http://localhost:5173";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(URL, {
      autoConnect: false,
    });
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
