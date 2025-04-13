import { useContext, createContext } from "react";
import { Socket } from "socket.io-client";

export interface IContact {
  id?: string;
  userId: string;
  contactId: string;
  username: string;
  isBlocked: boolean;
  isUnfriend: boolean;
  createdAt: Date;
  favorite: boolean;
}
export interface IUser {
  email: string;
  username: string;
  password: string;
  contacts: IContact[];
  isActive: boolean;
  sentMessage: [];
  receivedMessage: [];
}

interface IGlobalContextType {
  userId: string;
  setUserId: (id: string, sessionExpiry?: number) => void;

  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  userDetails: IUser | undefined;
  setUserDetails: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  socketIsConnected: boolean;
  setSocketIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const GlobalContext = createContext<IGlobalContextType | null>(null);
export const SocketContext = createContext<Socket | null>(null);
export const ThemeContext = createContext<IThemeContextType | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within theme provider");
  return context;
};
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
