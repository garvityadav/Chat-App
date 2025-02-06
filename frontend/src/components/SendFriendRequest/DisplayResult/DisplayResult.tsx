import { IFriendDetail } from "../SendFriendRequest";
import AddFriend from "./AddFriend/AddFriendRequest";

const DisplayResult = ({
  friendDetail,
}: {
  friendDetail: IFriendDetail | undefined;
}) => {
  console.log(friendDetail);
  return (
    <div>
      {friendDetail && <p>{friendDetail?.fullName}</p>}
      {friendDetail?.isContact == false && (
        <AddFriend contactId={friendDetail.id} />
      )}
    </div>
  );
};

export default DisplayResult;
