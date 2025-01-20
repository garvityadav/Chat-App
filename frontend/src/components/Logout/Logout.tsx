import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useGlobalContext } from "../../contexts/GlobalContext";
const Logout = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { setUserId, setContactId } = useGlobalContext();
  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      setUserId("");
      setContactId("");
      socket?.disconnect();
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0];
        console.log(cookieName);
        document.cookie = `${cookieName}=;expires=${new Date(
          0
        ).toUTCString()};path=/;`;
      });
      if (socket?.disconnected) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setUserId("");
      setContactId("");
      socket?.disconnect();
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0];
        console.log(cookieName);
        document.cookie = `${cookieName}=;expires=${new Date(
          0
        ).toUTCString()};path=/;`;
      });
      if (socket?.disconnected) {
        navigate("/");
      }
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
