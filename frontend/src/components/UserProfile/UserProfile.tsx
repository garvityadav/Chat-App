import { useState } from "react";
import Logout from "../Logout/Logout";
import SendFriendRequest from "../SendFriendRequest/SendFriendRequest";
import { useGlobalContext } from "../../contexts/ExportingContexts";
const UserProfile = () => {
  const [toggleVisibility, setToggleVisibility] = useState(false);
  const { userDetails } = useGlobalContext();
  console.log(userDetails);
  const username = userDetails?.username;
  return (
    <div>
      {username}
      <div>Status:{userDetails?.isActive ? "Online" : "Offline"}</div>
      <div>User profile</div>
      <div>contacts</div>
      <div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='size-6'
          onClick={() => setToggleVisibility(true)}
        >
          <path d='M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z' />
        </svg>
        {toggleVisibility && (
          <SendFriendRequest
            isOpen={true}
            onClose={() => {
              setToggleVisibility(false);
            }}
          />
        )}
      </div>
      <div>
        Pending requests
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='size-6'
        >
          <path
            fillRule='evenodd'
            d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
            clipRule='evenodd'
          />
        </svg>
      </div>
      <Logout />
    </div>
  );
};

export default UserProfile;
