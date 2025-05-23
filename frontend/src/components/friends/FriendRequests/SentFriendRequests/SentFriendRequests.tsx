import { IFriendRequests } from "../FriendRequests";
import { Trash2 } from "lucide-react";

const SentFriendRequests = ({
  data,
  refreshMainList,
}: {
  data: IFriendRequests;
  refreshMainList: () => void;
}) => {
  const fullName = data.Receiver?.username.fullName;
  const handleResponse = async () => {
    refreshMainList();
  };
  return (
    <div
      className='flex flex-row justify-between item-center gap-2 m-2 scroll-auto border-b 
       border-gray-200
       pb-2'
    >
      {fullName ? (
        <p title={fullName}>{fullName.split("#")[0]}</p>
      ) : (
        <p title='Unknown User'>Unknown User</p>
      )}
      <button
        title='Delete'
        className='cursor-pointer'
        onClick={handleResponse}
        type='button'
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default SentFriendRequests;
