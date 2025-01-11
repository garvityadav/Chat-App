//Chat window component where user can chat with other users
// implement socket.io for real time chatting

import ConversationDisplay from "./ConversationWindow";
import TypingSpace from "./TypingSpace";
import { useGlobalContext } from "../contexts/GlobalContext";

const ChatWindow = () => {
  const globalContext = useGlobalContext();
  const userId = globalContext?.userId || "";
  const contactId = globalContext?.contactId || "";
  return (
    <div>
      <ConversationDisplay userId={userId} contactId={contactId} />
      <TypingSpace userId={userId} contactId={contactId} />
    </div>
  );
};

export default ChatWindow;
