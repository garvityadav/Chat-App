import { useContext, createContext } from "react";
import { Socket } from "socket.io-client";
interface IGlobalContextType {
  userId: string;
  setUserId: (id: string, sessionExpiry?: number) => void;

  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  socketIsConnected: boolean;
  setSocketIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  contactId: string;
  setContactId: React.Dispatch<React.SetStateAction<string>>;
}

export const GlobalContext = createContext<IGlobalContextType | null>(null);
export const SocketContext = createContext<Socket | null>(null);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("global context must be used within a UserProvider");
  }
  return context;
};
export const useSocket = () => {
  return useContext(SocketContext);
};
