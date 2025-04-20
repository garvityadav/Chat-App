import axios from "axios";
import { IFriendRequests } from "../FriendRequests";
import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ReceivedFriendRequests = ({ data }: { data: IFriendRequests }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const fullName = data.Sender?.username.fullName;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);
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
    <div
      className={`flex flex-row justify-between item-center gap-2 m-2 scroll-auto border-b ${
        error ? "border-red-400" : "border-gray-200"
      } pb-2`}
    >
      {fullName ? (
        <p title={fullName}>{fullName.split("#")[0]}</p>
      ) : (
        <p title='Unknown User'>Unknown User</p>
      )}
      {!error && !success && (
        <div className='flex gap-2'>
          <button
            className='cursor-pointer'
            onClick={handleAddFriend}
            type='button'
          >
            <UserPlus size={20} />
          </button>
          <button className='cursor-pointer'>
            <Trash2 size={20} />
          </button>
        </div>
      )}
      {error && (
        <p className='text-red-600  font-semibold'>Error adding friend</p>
      )}
      {success && <p className='text-green-400 font-semibold'>Friend Added!</p>}
    </div>
  );
};

export default ReceivedFriendRequests;
