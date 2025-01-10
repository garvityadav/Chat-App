//Chat window component where user can chat with other users
// implement socket.io for real time chatting

import MessageDisplay from "./MessageDisplay";
import TypingSpace from "./TypingSpace";

const ChatWindow = () => {
  return (
    <div>
      <MessageDisplay />
      <TypingSpace />
    </div>
  );
};

export default ChatWindow;
