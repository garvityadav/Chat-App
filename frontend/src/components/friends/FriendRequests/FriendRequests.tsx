import axios from "axios";
import { useEffect, useState } from "react";
import ReceivedFriendRequests from "./ReceivedFriendRequests/ReceivedFriendRequests";
import SentFriendRequests from "./SentFriendRequests/SentFriendRequests";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export interface IFriendRequests {
  id: string;
  userId: string;
  contactId: string;
  accepted: boolean;
  rejected: boolean;
  createdAt: Date;
  isDeleted: boolean;
  Receiver?: { username: { fullName: string } };
  Sender?: { username: { fullName: string } };
}
const FriendRequests = () => {
  const [sentRequests, setSentRequests] = useState<IFriendRequests[]>();
  const [receiveRequests, setReceiveRequests] = useState<IFriendRequests[]>();
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    const fetchFriendRequestsReceived = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/user/friend-requests?received=true`,
          {
            withCredentials: true,
          }
        );
        if (response.status == 200) {
          console.log(response.data.data);
          setReceiveRequests(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchFriendRequestSent = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/user/friend-requests?sent=true`,
          { withCredentials: true }
        );
        if (response.status == 200) {
          setSentRequests(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriendRequestsReceived();
    fetchFriendRequestSent();
  }, []);

  return (
    <div className=' flex flex-col'>
      <div className='grid grid-cols-2 text-center w-sm'>
        <div
          className={activeTab == "sent" ? "border-2" : ""}
          onClick={() => {
            setActiveTab("sent");
          }}
        >
          Sent
        </div>
        <div
          className={activeTab == "received" ? "border-2" : ""}
          onClick={() => {
            setActiveTab("received");
          }}
        >
          Received
        </div>

        {/* displayed results */}
      </div>
      <div className='p-2 flex flex-col gap-2'>
        {activeTab == "send" &&
          sentRequests &&
          sentRequests.map((request) => {
            return (
              <div key={request.id}>
                <SentFriendRequests data={request} />
              </div>
            );
          })}

        {activeTab == "received" &&
          receiveRequests &&
          receiveRequests.map((request) => {
            return (
              <div key={request.id}>
                <ReceivedFriendRequests data={request} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FriendRequests;
