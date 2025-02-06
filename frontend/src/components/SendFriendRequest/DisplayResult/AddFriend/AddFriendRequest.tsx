import axios from "axios";
import { useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AddFriend = ({ contactId }: { contactId: string }) => {
  const [result, setResult] = useState(false);
  const [error, setError] = useState(false);
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
      <button type='button' onClick={handleRequest}>
        send Friend Request
      </button>
      {result && <p style={{ color: "green" }}>Request Sent!</p>}
      {error && <p style={{ color: "red" }}>Error sending request!</p>}
    </>
  );
};

export default AddFriend;
