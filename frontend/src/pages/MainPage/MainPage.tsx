import ChatWindow from "../../components/ChatWindowBox/ChatWindowBox";
import ChatList from "../../components/ChatList/ChatList";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import Logout from "../../components/Logout/Logout";
import { MainPageWrapper, LeftColumn, RightColumn } from "./MainPageStyles";
import UserProfile from "../../components/UserProfile/UserProfile";
import Search from "../../components/Search/Search";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// section having user name and status

function MainPage() {
  const { contactId } = useGlobalContext();
  const navigate = useNavigate();
  const { userId } = useGlobalContext();
  useEffect(() => {
    if (!userId) {
      navigate("/error/unauthorize");
    }
  }, [userId, navigate]);
  return (
    <MainPageWrapper>
      <LeftColumn>
        <Search />
        <ChatList />
        <UserProfile />
        <Logout />
      </LeftColumn>
      <RightColumn>{contactId && <ChatWindow />}</RightColumn>
    </MainPageWrapper>
  );
}

export default MainPage;
