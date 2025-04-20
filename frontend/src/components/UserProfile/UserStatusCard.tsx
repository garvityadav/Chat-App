import { useEffect, useRef, useState } from "react";
import { Cog } from "lucide-react";
import { useGlobalContext, useTheme } from "../../contexts/ExportingContexts";
import Logout from "../auth/Logout/Logout";
import ManageAccount from "./ManageAccount";

const UserProfile = () => {
  const { userDetails } = useGlobalContext();
  const { darkMode } = useTheme();
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [toggleManageAccount, setToggleManageAccount] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        setShowUserDialog(false);
      }
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowUserDialog(false);
      }
    };
    if (showUserDialog) {
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [setShowUserDialog, showUserDialog]);

  return (
    <div
      className={`relative p-3 border-t ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <div
        className='flex items-center gap-3 cursor-pointer'
        onClick={() => setShowUserDialog(!showUserDialog)}
      >
        <div className='relative'>
          <div
            className={`w-10 h-10 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            <span className='font-medium dark:text-white'>
              {userDetails?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
              darkMode ? "border-gray-800" : "border-white"
            } ${userDetails?.isActive ? "bg-green-500" : "bg-gray-400"}`}
          ></span>
        </div>

        {/* Username and Status */}
        <div className='overflow-hidden'>
          <p className={`font-medium truncate dark:text-white`}>
            {userDetails?.username}
          </p>
          <p className='text-xs dark:text-gray-400'>
            {userDetails?.isActive ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* UserDialog */}
      {showUserDialog && (
        <div
          ref={modalRef}
          className={`absolute gap-3 item-center left-0 bottom-full flex flex-col mb-2 w-64 rounded-lg shadow-lg p-3 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <button
            className='flex flex-1/2 gap-1 item-center relative'
            onClick={() => {
              setToggleManageAccount(!toggleManageAccount);
              setShowUserDialog(!showUserDialog);
            }}
          >
            <Cog className='cursor-pointer' />
            <p className='cursor-pointer'>Manage Account</p>
          </button>
          <Logout />
        </div>
      )}
      {/* Manage account dialog */}
      {toggleManageAccount && (
        <ManageAccount
          isOpen={toggleManageAccount}
          onClose={() => setToggleManageAccount(!toggleManageAccount)}
        />
      )}
    </div>
  );
};

export default UserProfile;
