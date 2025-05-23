import { useEffect, useState } from "react";
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [error, setError]);

  return (
    <div className='flex flex-col p-2 m-3 gap-2'>
      {error && <p className=' text-red-700'>Error : {error}</p>}
      <FindUsername setError={setError} setFriendDetail={setFriendDetail} />
      {friendDetail && (
        <div
          className='
        '
        >
          <DisplayResult friendDetail={friendDetail} />
        </div>
      )}
    </div>
  );
};

export default SendFriendRequest;
