import FriendRequests from "../FriendRequests/FriendRequests";
import SendFriendRequest from "../SendFriendRequest/SendFriendRequest";

const Header = () => {
  return (
    <div>
      <SendFriendRequest />
      {/* Create a hover like window for sending/searching or receiving friend requests */}
      <button type='button'>Pending Requests</button>
    </div>
  );
};

export default Header;
