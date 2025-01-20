import { useEffect } from "react";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useSocket } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { setUserId, setContactId } = useGlobalContext();
  const socket = useSocket();
  useEffect(() => {
    //clean up logic
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

    //redirecting to landing page
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); //3 sec delay
    return () => {
      clearTimeout(timer);
    };
  }, [navigate, setUserId, setContactId, socket]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
      <p>Unauthorized access , redirecting to login page</p>
    </div>
  );
};

export default Unauthorized;
