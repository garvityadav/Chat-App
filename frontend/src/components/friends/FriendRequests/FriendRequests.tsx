import axios from "axios";
import { useEffect, useState } from "react";
import ReceivedFriendRequests from "./ReceivedFriendRequests/ReceivedFriendRequests";
import SentFriendRequests from "./SentFriendRequests/SentFriendRequests";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export interface IFriendRequests {
  id: string;
  userId: string;
  senderId: string;
  receiverId: string;
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
  const fetchFriendRequestsReceived = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/user/friend-requests?received=true`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
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
  useEffect(() => {
    fetchFriendRequestsReceived();
    fetchFriendRequestSent();
  }, []);

  return (
    <div className=' flex flex-col'>
      <div className='grid grid-cols-2 text-center w-sm'>
        <div
          className={activeTab == "received" ? "border-b p-1" : "p-1"}
          onClick={() => {
            setActiveTab("received");
          }}
        >
          Received
        </div>
        <div
          className={activeTab == "sent" ? "border-b p-1" : "p-1"}
          onClick={() => {
            setActiveTab("sent");
          }}
        >
          Sent
        </div>

        {/* displayed results */}
      </div>
      <div className='p-3'>
        {activeTab == "received" && receiveRequests && (
          <div className='flex   flex-col gap-2 max-h-64 overflow-y-auto pr-2'>
            {receiveRequests.map((request) => {
              return (
                <div key={request.id}>
                  <ReceivedFriendRequests
                    data={request}
                    refreshMainList={fetchFriendRequestsReceived}
                  />
                </div>
              );
            })}
          </div>
        )}
        {activeTab == "received" && receiveRequests?.length == 0 && (
          <p>No Pending Requests!</p>
        )}
        {activeTab == "sent" && sentRequests && (
          <div className='flex flex-col  gap-2 max-h-64 overflow-y-auto pr-2'>
            {sentRequests.map((request) => {
              return (
                <div key={request.id}>
                  <SentFriendRequests
                    data={request}
                    refreshMainList={fetchFriendRequestSent}
                  />
                </div>
              );
            })}
          </div>
        )}

        {activeTab == "sent" && sentRequests?.length == 0 && (
          <p>No Request Sent!</p>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
