import ChatWindow from "../../components/ChatWindowBox/ChatWindowBox";
import ChatList from "../../components/ChatList/ChatList";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import "./MainPageStyles.css";
import UserProfile from "../../components/UserProfile/UserProfile";
import Search from "../../components/Search/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
// section having user name and status
const backendUrl = import.meta.env.VITE_BACKEND_URL;
function MainPage() {
  const { userId, setUserDetails } = useGlobalContext();
  const [contactId, setContactId] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      navigate("/error/unauthorize");
    }
    const fetchUser = async () => {
      const response = await axios.get(`${backendUrl}/user`, {
        withCredentials: true,
      });
      if (response) {
        setUserDetails(response.data.data);
      }
    };
    fetchUser();
  }, []);
  return (
    userId && (
      <div className='grid  grid-row-3 h-screen border-2 bg-yellow-400'>
        <Header />
        <Search />
        <ChatList setContactId={setContactId} />
        <UserProfile />
        {contactId && (
          <ChatWindow contactId={contactId} setContactId={setContactId} />
        )}
      </div>
    )
  );
}

export default MainPage;
