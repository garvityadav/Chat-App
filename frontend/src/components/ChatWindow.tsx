//Chat window component where user can chat with other users

import MessageDisplay from "./MessageDisplay";
import TypingSpace from "./TypingSpace";

function ChatWindow() {
  return (
    <div>
      <MessageDisplay />
      <TypingSpace />
    </div>
  );
}

export default ChatWindow;
