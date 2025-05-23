import axios from "axios";
import { useEffect, useState } from "react";
import { Check, UserPlus } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddFriend = ({ contactId }: { contactId: string }) => {
  const [result, setResult] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    setResult(false);
    const timeoutId = setTimeout(() => {
      setError(false);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
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
      setResult(false);
    }
  };
  return (
    <>
      {!error && !result && (
        <button
          type='button'
          className='cursor-pointer'
          onClick={() => handleRequest()}
          title='Add friend'
        >
          <UserPlus />
        </button>
      )}
      {result && <Check />}
    </>
  );
};

export default AddFriend;
