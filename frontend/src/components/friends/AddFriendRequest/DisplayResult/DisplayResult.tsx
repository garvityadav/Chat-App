import { IFriendDetail } from "../AddFriendRequest";
import AddFriend from "./AddFriend";
import { Check } from "lucide-react";
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
        <Check />
      )}
    </div>
  );
};

export default DisplayResult;
