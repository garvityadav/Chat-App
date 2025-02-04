import { IFriendDetail } from "../SendFriendRequest";
import AddFriend from "./AddFriend/AddFriend";

const DisplayResult = ({
  friendDetail,
}: {
  friendDetail: IFriendDetail | undefined;
}) => {
  return (
    <div>
      <p>{friendDetail?.username}</p>
      {friendDetail?.isContact == false && (
        <AddFriend contactId={friendDetail.id} />
      )}
    </div>
  );
};

export default DisplayResult;
