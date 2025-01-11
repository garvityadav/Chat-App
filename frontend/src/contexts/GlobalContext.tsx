import { createContext, useState, useContext } from "react";
import { ReactNode } from "react";
import PropTypes from "prop-types";

interface IGlobalContextType {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  socketIsConnected: boolean;
  setSocketIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  contactId: string;
  setContactId: React.Dispatch<React.SetStateAction<string>>;
}
interface IGlobalProviderProps {
  children: ReactNode;
}

const GlobalContext = createContext<IGlobalContextType | null>(null);

export const GlobalProvider = ({ children }: IGlobalProviderProps) => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [contactId, setContactId] = useState("");
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
        contactId,
        setContactId,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("global context must be used within a UserProvider");
  }
  return context;
};
