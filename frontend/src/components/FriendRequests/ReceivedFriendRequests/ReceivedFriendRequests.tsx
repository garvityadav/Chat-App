import axios from "axios";
import { IFriendRequests } from "../FriendRequests";
import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ReceivedFriendRequests = ({ data }: { data: IFriendRequests }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const handleAddFriend = async () => {
    try {
      setError(false);
      const response = await axios.get(
        `${backendUrl}/user/add-contact/${data.contactId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 201) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  return (
    <div>
      <p>{data.Sender?.username.fullName}</p>
      <button onClick={handleAddFriend} type='button'>
        Accept
      </button>
      {error && <p style={{ color: "red" }}>Error adding friend</p>}
      {success && <p style={{ color: "green" }}>Added friend!</p>}
    </div>
  );
};

export default ReceivedFriendRequests;
