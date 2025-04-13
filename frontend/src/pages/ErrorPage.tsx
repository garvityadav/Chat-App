import { useEffect } from "react";
import { useSocket } from "../contexts/ExportingContexts";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react"; // Optional: Add an icon

const Unauthorized = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    // Disconnect socket
    socket?.disconnect();

    // Clear all storage mechanisms
    const clearAllStorage = () => {
      localStorage.clear();
      sessionStorage.clear();

      // More robust cookie clearing
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    };

    clearAllStorage();

    // Redirect after cleanup
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    // Cleanup timer on component unmount
    return () => {
      clearTimeout(timer);
    };
  }, [navigate, socket]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-red-50'>
      <div className='text-center p-8 bg-white shadow-md rounded-lg'>
        <Lock className='mx-auto mb-4 text-red-500' size={48} />
        <h2 className='text-2xl font-bold text-red-600 mb-4'>
          Unauthorized Access
        </h2>
        <p className='text-gray-600'>
          You do not have permission to access this page.
          <br />
          Redirecting to login page in 3 seconds...
        </p>
        <div className='mt-6'>
          <div className='w-full bg-red-500 h-1 animate-pulse'></div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
