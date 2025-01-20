// list of online users under online tab and offline users under offline tab
// active chat window
// header
//

import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindowBox/ChatWindowBox";
import ChatList from "../components/ConversationList/ConversationList";
import { useGlobalContext } from "../contexts/GlobalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout/Logout";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// section having user name and status
function MainPage() {
  const navigate = useNavigate();
  const { setUserId, contactId } = useGlobalContext();
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user?id=true`, {
          withCredentials: true,
        });
        if (response.data.status === 200) {
          setUserId(response.data.data.id);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        setError("unauthorized");
        console.log(error);
        navigate("/");
      }
    };
    fetchUserId();
  }, [setUserId, navigate]);

  return (
    <div style={{ display: "grid" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Logout />
      <ChatList />
      {contactId && <ChatWindow />}
    </div>
  );
}

export default MainPage;
