import UserStatusCard from "../../components/UserProfile/UserStatusCard";
import Search from "../../components/chat/Search/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Header/Header";
import { useGlobalContext, useTheme } from "../../contexts/ExportingContexts";
import ChatList from "../../components/chat/ChatList/ChatList";
import ChatWindow from "../../components/chat/ChatWindowBox/ChatWindowBox";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function MainPage() {
  const { userId, setUserDetails } = useGlobalContext();
  const [contactId, setContactId] = useState("");
  const { darkMode } = useTheme();
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    userId && (
      <div
        className={`flex h-screen  ${
          darkMode ? "dark bg-gray-900" : "bg-gray-100"
        }`}
      >
        {/* Left Sidebar */}
        <div className='w-1/4 flex flex-col border-r relative dark:border-gray-700 bg-white dark:bg-gray-800'>
          <Header />

          <div className='p-4 border-b dark:border-gray-700'>
            <Search />
          </div>

          <ChatList setContactId={setContactId} />
          <div className='absolute bottom-0 left-0 w-full p-4'>
            <UserStatusCard />
          </div>
        </div>
        {/* Main chat Area */}
        <div className='flex-1 flex flex-col'>
          {contactId ? (
            <ChatWindow contactId={contactId} setContactId={setContactId} />
          ) : (
            <div className='flex-1 flex item-center justify-center bg-gray-50 dark:bg-gray-900'>
              <div className='text-center p-6 max-w-md'>
                <h2 className='text-xl font-semibold dark:text-gray-200 mb-2'>
                  Welcome to your Chat!
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  Select a conversation or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default MainPage;
