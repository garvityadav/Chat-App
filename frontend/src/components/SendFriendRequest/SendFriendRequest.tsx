import { useState } from "react";
import TypeUsername from "./TypeUsername/TypeUsername";
import DisplayResult from "./DisplayResult/DisplayResult";

export interface IFriendDetail {
  id: string;
  requestUserId: string;
  fullName: string;
  isContact: boolean;
}

const SendFriendRequest = () => {
  const [friendDetail, setFriendDetail] = useState<IFriendDetail>();
  return (
    <>
      <TypeUsername setFriendDetail={setFriendDetail} />
      <DisplayResult friendDetail={friendDetail} />
    </>
  );
};

export default SendFriendRequest;
