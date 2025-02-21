import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddFriend = ({ contactId }: { contactId: string }) => {
  const [result, setResult] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(false);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  });
  const handleRequest = async () => {
    try {
      setError(false);
      const response = await axios.get(
        `${backendUrl}/user/send-friend-request?contactId=${contactId}`,
        { withCredentials: true }
      );
      if (response.status == 201) {
        setResult(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  return (
    <>
      {error == false && result == false && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='size-6 hover:invert'
          onClick={handleRequest}
        >
          <title>Add friend</title>
          <path d='M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 13c.552 0 1.01-.452.9-.994a5.002 5.002 0 0 0-9.802 0c-.109.542.35.994.902.994h8ZM12.5 3.5a.75.75 0 0 1 .75.75v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1v-1a.75.75 0 0 1 .75-.75Z' />
        </svg>
      )}

      {result && error == false && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='size-6'
        >
          <path
            fillRule='evenodd'
            d='M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z'
            clipRule='evenodd'
          />
        </svg>
      )}

      {error && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='size-6  text-red-700'
        >
          <path
            fillRule='evenodd'
            d='M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
            clipRule='evenodd'
          />
          <title>Error sending request</title>
        </svg>
      )}
    </>
  );
};

export default AddFriend;
