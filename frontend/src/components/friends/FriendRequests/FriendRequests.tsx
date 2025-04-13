import axios from "axios";
import { useEffect, useState, useRef } from "react";
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
const FriendRequests = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [sentRequests, setSentRequests] = useState<IFriendRequests[]>();
  const [receiveRequests, setReceiveRequests] = useState<IFriendRequests[]>();
  const [toggleSentSection, setToggleSentSection] = useState(false);
  const [toggleReceivedSection, setToggleReceivedSection] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        onClose();
      }
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [onClose, isOpen]);

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

  if (!isOpen) {
    return null;
  }

  return (
    <div className='hover-overlay'>
      <div className='hover-modal absolute top-10 '>
        <div className='grid grid-cols-2 text-center w-sm'>
          <div
            className={toggleSentSection ? "border-2" : ""}
            onClick={() => {
              setToggleSentSection(true);
              setToggleReceivedSection(false);
            }}
          >
            Sent
          </div>
          <div
            className={toggleReceivedSection ? "border-2" : ""}
            onClick={() => {
              setToggleSentSection(false);
              setToggleReceivedSection(true);
            }}
          >
            Received
          </div>
        </div>

        {toggleSentSection &&
          sentRequests &&
          sentRequests.map((request) => {
            return (
              <div key={request.id}>
                <SentFriendRequests data={request} />
              </div>
            );
          })}

        {toggleReceivedSection &&
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
