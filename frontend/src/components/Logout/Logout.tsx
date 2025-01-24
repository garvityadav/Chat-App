import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket, useGlobalContext } from "../../contexts/ExportingContexts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Logout = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { setContactId } = useGlobalContext();
  const cleaning = () => {
    setContactId("");
    socket?.disconnect();
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0];
      document.cookie = `${cookieName}=;expires=${new Date(
        0
      ).toUTCString()};path=/;`;
    });
    if (socket?.disconnected) {
      navigate("/");
    }
  };
  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      cleaning();
    } catch (error) {
      console.log(error);
      cleaning();
    }
  };
  return (
    <div>
      <button type='button' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
