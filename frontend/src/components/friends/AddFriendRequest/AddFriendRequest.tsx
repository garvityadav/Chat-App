import { useState } from "react";
import FindUsername from "./TypeUsername/FindUsername";
import DisplayResult from "./DisplayResult/DisplayResult";
export interface IFriendDetail {
  reqUserId: string;
  fullName: string;
  isContact: boolean;
  friendRequest: boolean;
}

const SendFriendRequest = () => {
  const [friendDetail, setFriendDetail] = useState<IFriendDetail>();
  const [error, setError] = useState("");

  return (
    <div>
      <div>
        <FindUsername setError={setError} setFriendDetail={setFriendDetail} />
        {error && (
          <span className='hove-modal absolute transform translate-x-1/2 left-1/2'>
            {error}
          </span>
        )}
        {friendDetail && (
          <div className='hover-modal absolute m-10 left-20'>
            <DisplayResult friendDetail={friendDetail} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SendFriendRequest;
