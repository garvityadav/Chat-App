import { IFriendRequests } from "../FriendRequests";

const SentFriendRequests = ({ data }: { data: IFriendRequests }) => {
  const handleResponse = async () => {};
  return (
    <div className='grid grid-cols-2 w-sm items-center m-2'>
      {data.Receiver?.username.fullName}
      <button className='w-1/2' onClick={handleResponse} type='button'>
        Delete
      </button>
    </div>
  );
};

export default SentFriendRequests;
