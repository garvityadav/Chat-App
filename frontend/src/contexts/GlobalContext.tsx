import { createContext, useState, useContext } from "react";
import { ReactNode } from "react";

interface IGlobalContextType {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  socketIsConnected: boolean;
  setSocketIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IGlobalProviderProps {
  children: ReactNode;
}

const GlobalContext = createContext<IGlobalContextType | null>(null);

export const UserProvider = ({ children }: IGlobalProviderProps) => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [socketIsConnected, setSocketIsConnected] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        userId,
        setUserId,
        email,
        setEmail,
        socketIsConnected,
        setSocketIsConnected,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
