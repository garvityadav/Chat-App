import { Moon, Sun, UserPlus, Users } from "lucide-react";
import { useTheme } from "../../../contexts/ExportingContexts";
import { useState } from "react";

const Header = ({ children }: { children?: React.ReactNode }) => {
  const { darkMode, toggelTheme } = useTheme();
  const [showRequest, setShowRequest] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  return (
    <header className='p-4 border-b dark:border-gray-700 dark:bg-gray-800 bg-white flex justify-between items-center'>
      <h1 className='text-x1 font-bold dark:text-white'>
        <h1>CHAT APP</h1>
        {children}
      </h1>
      <div className='flex flex-row'></div>
      {/* Create a hover like window for sending/searching or receiving friend requests */}
    </header>
  );
};

export default Header;
