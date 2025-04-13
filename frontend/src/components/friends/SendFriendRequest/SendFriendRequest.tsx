import { useEffect, useState, useRef } from "react";
import FindUsername from "./TypeUsername/FindUsername";
import DisplayResult from "./DisplayResult/DisplayResult";
import "./SendFriendRequest.css";
export interface IFriendDetail {
  reqUserId: string;
  fullName: string;
  isContact: boolean;
  friendRequest: boolean;
}

const SendFriendRequest = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [friendDetail, setFriendDetail] = useState<IFriendDetail>();
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setError("");
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
  }, [setError, onClose, isOpen]);
  if (!isOpen) {
    return null;
  }
  return (
    <div className='hover-overlay'>
      <div className='hover-modal absolute top-10' ref={modalRef}>
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
