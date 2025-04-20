import { useEffect, useRef, useState } from "react";
import FriendRequests from "../friends/FriendRequests/FriendRequests";
import { Contact, UserCog, UserPlus, Users, X } from "lucide-react";
import UserProfile from "./UserProfile";
import AddFriendRequest from "../friends/AddFriendRequest/AddFriendRequest";

const ManageAccount = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        onClose();
      }
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [onClose, isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center  bg-black opacity-50'>
      <div
        className='flex w-[700px] h-[400px] rounded-x1 shadow-x1 bg-gray-400 overflow-hidden'
        ref={modalRef}
      >
        {/* left tabs */}
        <div className='flex w-1/3 flex-col gap-4 border-r p-4 bg-gray-300'>
          <button
            className={`flex  item-center gap-2 p-2 rounded-md hover:bg-gray-200 ${
              activeTab == "profile" && "bg-gray-300 font-semibold"
            } `}
            onClick={() => setActiveTab("profile")}
          >
            <UserCog size={20} />
            Profile
          </button>
          <button
            className={`flex item-center gap-2 p-2 rounded-md hover:bg-gray-200 ${
              activeTab == "addFriend" && "bg-gray-300 font-semibold"
            } `}
            onClick={() => setActiveTab("addFriend")}
          >
            <UserPlus size={20} />
            Add Friend
          </button>
          <button
            className={`flex item-center gap-2 p-2 rounded-md hover:bg-gray-200 ${
              activeTab == "friendRequests" && "bg-gray-300 font-semibold"
            } `}
            onClick={() => setActiveTab("friendRequests")}
          >
            <Users size={20} />
            Requests
          </button>
          <button
            className={`flex item-center gap-2 p-2 rounded-md hover:bg-gray-200 ${
              activeTab == "friends" && "bg-gray-300 font-semibold"
            } `}
            onClick={() => setActiveTab("friends")}
          >
            <Contact size={20} />
            Friends
          </button>
        </div>

        {/* Right section */}

        <div className='w-2/3 p-5 overflow-y-auto relative'>
          <button
            className='absolute top-2 right-2 hover:text-gray-50 cursor-pointer'
            onClick={onClose}
          >
            <X />
          </button>
          {activeTab == "profile" && <UserProfile />}
          {activeTab == "addFriend" && <AddFriendRequest />}
          {activeTab == "friendRequests" && <FriendRequests />}
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
