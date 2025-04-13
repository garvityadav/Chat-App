import { useState } from "react";
import { useGlobalContext, useTheme } from "../../contexts/ExportingContexts";
import Logout from "../auth/Logout/Logout";

const UserProfile = () => {
  const { userDetails } = useGlobalContext();
  const { darkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative p-3 border-t ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      {/* Clickable User Area */}
      <div
        className='flex items-center gap-3 cursor-pointer'
        onClick={() => setIsHovered(!isHovered)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar with Online Indicator */}
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
          <p className='font-medium truncate dark:text-white'>
            {userDetails?.username}
          </p>
          <p className='text-xs dark:text-gray-400'>
            {userDetails?.isActive ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Future Details Panel (Will implement later) */}
      {isHovered && (
        <div
          className={`absolute left-0 bottom-full mb-2 w-64 rounded-lg shadow-lg ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Placeholder for future content */}
          <div className='p-4'>
            <p className='text-sm dark:text-gray-300'>
              User details panel coming soon!
            </p>
            <Logout />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
