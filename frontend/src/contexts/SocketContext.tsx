import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext, useGlobalContext } from "./ExportingContexts";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL_ONLY;
const URL =
  import.meta.env.VITE_NODE_ENV === "production" ? undefined : backendUrl;
const toggleStatus = async (status: string) => {
  try {
    await axios.get(`${backendUrl}/api/v1/user/status?status=${status}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const SocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userId } = useGlobalContext();
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

      //toggle user online status
      toggleStatus("online");
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
