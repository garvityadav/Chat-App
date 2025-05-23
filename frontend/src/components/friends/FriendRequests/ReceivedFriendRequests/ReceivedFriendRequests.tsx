import axios from "axios";
import { IFriendRequests } from "../FriendRequests";
import { useEffect, useState } from "react";
import { Check, Trash2, UserPlus } from "lucide-react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ReceivedFriendRequests = ({
  data,
  refreshMainList,
}: {
  data: IFriendRequests;
  refreshMainList: () => void;
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const fullName = data.Sender?.username.fullName;

  useEffect(() => {
    let refetchTimerId: NodeJS.Timeout;
    let timerId: NodeJS.Timeout;
    if (success) {
      refetchTimerId = setTimeout(() => {
        refreshMainList();
        setSuccess(false);
      }, 3000);
    }
    if (error) {
      timerId = setTimeout(() => {
        setError(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timerId);
      clearTimeout(refetchTimerId);
    };
  }, [success, error, refreshMainList]);

  //handleRequest
  const handleAddFriend = async () => {
    try {
      setError(false);
      console.log(data);
      const response = await axios.get(
        `${backendUrl}/user/add-contact/${data.senderId}`,
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
            title='Accept'
          >
            <UserPlus size={20} />
          </button>
          <button className='cursor-pointer' title='Delete'>
            <Trash2 size={20} />
          </button>
        </div>
      )}
      {error && (
        <p className='text-red-600  font-semibold'>Error adding friend</p>
      )}
      {success && (
        <p className=''>
          <Check />
        </p>
      )}
    </div>
  );
};

export default ReceivedFriendRequests;
