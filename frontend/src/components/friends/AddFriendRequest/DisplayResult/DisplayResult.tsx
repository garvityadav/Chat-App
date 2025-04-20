import { IFriendDetail } from "../AddFriendRequest";
import AddFriend from "./AddFriend/AddFriendRequest";

const DisplayResult = ({
  friendDetail,
}: {
  friendDetail: IFriendDetail | undefined;
}) => {
  console.log(friendDetail);
  return (
    <div className='flex-row flex gap-x-50 items-center'>
      {friendDetail && <p>{friendDetail?.fullName.split("#")[0]}</p>}
      {friendDetail?.friendRequest == false ? (
        <AddFriend contactId={friendDetail.reqUserId} />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='size-6'
        >
          <path
            fillRule='evenodd'
            d='M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z'
            clipRule='evenodd'
          />
        </svg>
      )}
    </div>
  );
};

export default DisplayResult;
