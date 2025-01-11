// list of online users under online tab and offline users under offline tab
// active chat window
// header
//

import ChatWindow from "../components/ChatWindow";
import ChatList from "../components/ContactChatList";

// section having user name and status
function MainPage() {
  return (
    <div>
      <ChatList />
      <ChatWindow />
    </div>
  );
}

export default MainPage;
