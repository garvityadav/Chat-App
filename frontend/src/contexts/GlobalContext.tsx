import { useState } from "react";
import { ReactNode } from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "./ExportingContexts";
import { getUser, setUser } from "../utils/Storage";
interface IGlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: IGlobalProviderProps) => {
  const [email, setEmail] = useState("");
  const [userId, setUserIdState] = useState(getUser() || "");
  const [userUsername, setUserUsername] = useState("");
  const [socketIsConnected, setSocketIsConnected] = useState(false);

  const setUserId = (id: string, sessionExpiry?: number) => {
    setUserIdState(id);
    if (id && sessionExpiry) {
      setUser(id, sessionExpiry);
    } else {
      sessionStorage.removeItem("userid");
      sessionStorage.removeItem("expiryTime");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        userId,
        setUserId,
        email,
        setEmail,
        socketIsConnected,
        setSocketIsConnected,
        userUsername,
        setUserUsername,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalProvider;
