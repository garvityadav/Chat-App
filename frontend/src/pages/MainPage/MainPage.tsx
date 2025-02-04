import ChatWindow from "../../components/ChatWindowBox/ChatWindowBox";
import ChatList from "../../components/ChatList/ChatList";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import Logout from "../../components/Logout/Logout";
import { MainPageWrapper, LeftColumn, RightColumn } from "./MainPageStyles";
import UserProfile from "../../components/UserProfile/UserProfile";
import Search from "../../components/Search/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";
// section having user name and status
const backendUrl = import.meta.env.VITE_BACKEND_URL;
function MainPage() {
  const { userId, setUserUsername } = useGlobalContext();
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
        const username = response.data.data.username;
        setUserUsername(username);
      }
    };
    fetchUser();
  }, [userId, navigate, setUserUsername]);
  return (
    <MainPageWrapper>
      <LeftColumn>
        <Search />
        <ChatList setContactId={setContactId} />
        <UserProfile />
        <Logout setContactId={setContactId} />
      </LeftColumn>
      <RightColumn>
        <Header />
        {contactId && (
          <ChatWindow contactId={contactId} setContactId={setContactId} />
        )}
      </RightColumn>
    </MainPageWrapper>
  );
}

export default MainPage;
