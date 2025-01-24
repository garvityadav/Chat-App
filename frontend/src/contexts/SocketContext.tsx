import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext, useGlobalContext } from "./ExportingContexts";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const URL =
  import.meta.env.VITE_NODE_ENV === "production" ? undefined : backendUrl;

export const SocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userId } = useGlobalContext() || "";
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
      const { userId } = data;
      console.log(`user registered: ${userId}`);
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

export default SocketProvider;
