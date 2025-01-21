//Chat window component where user can chat with other users
// implement socket.io for real time chatting

import ConversationWindow from "../ConversationWindow/ConversationWindow";
import TypingSpace from "../ChatInputBox/TypingSpace";
import { useGlobalContext } from "../../contexts/GlobalContext";
import ChatWindowHeader from "../ChatWindowHeader/ChatWindowHeader";

const ChatWindow = () => {
  const globalContext = useGlobalContext();
  const userId = globalContext?.userId || "";
  const contactId = globalContext?.contactId || "";
  const setContactId = globalContext?.setContactId || "";
  return (
    <div style={{ display: "grid", columnGap: "50px" }}>
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
    </div>
  );
};

export default ChatWindow;
