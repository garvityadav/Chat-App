//Chat window component where user can chat with other users
// implement socket.io for real time chatting

import ConversationWindow from "../ConversationWindow/ConversationWindow";
import TypingSpace from "../ChatInputBox/TypingSpace";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import ChatWindowHeader from "../ChatWindowHeader/ChatWindowHeader";
import { ChatWindowBoxStyles } from "./ChatWindowBoxStyles";
import { useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ChatWindow = () => {
  const { userId, contactId, setContactId } = useGlobalContext();

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${backendUrl}/api/user`);
    };
    getUser();
  }, [contactId]);

  return (
    <ChatWindowBoxStyles>
      <button
        type='button'
        onClick={() => {
          setContactId("");
        }}
      >
        Close Chat
      </button>
      <ChatWindowHeader />
      <ConversationWindow userId={userId} contactId={contactId} />
      <TypingSpace userId={userId} contactId={contactId} />
    </ChatWindowBoxStyles>
  );
};

export default ChatWindow;
