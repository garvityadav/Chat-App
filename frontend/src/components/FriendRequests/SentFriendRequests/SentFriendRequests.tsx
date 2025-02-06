import { IFriendRequests } from "../FriendRequests";

const SentFriendRequests = ({ data }: { data: IFriendRequests }) => {
  const handleResponse = async () => {};
  return (
    <div>
      {data.Receiver?.username.fullName}
      <button onClick={handleResponse} type='button'>
        Delete
      </button>
    </div>
  );
};

export default SentFriendRequests;
