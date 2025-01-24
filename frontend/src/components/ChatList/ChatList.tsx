// ////////////////////////////////////////
// // Here there will be the list of all the user's friends
// ////////////////////////////////////////

import { useEffect, useState } from "react";
import SingleSideChat from "../SingleSideChat/SingleSideChat";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface IContactList {
  contactId: string;
  id: string;
  content: string;
  username: string;
  read: boolean;
  createdAt: Date;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ChatList = () => {
  const [messageList, setMessageList] = useState<IContactList[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setError("");
    const handelRender = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/messaging/list`,
          { withCredentials: true }
        );
        if (!response) {
          setError("Error retrieving messages");
          navigate("/error/unauthorize");
        }
        const responseMessageList: IContactList[] = response.data.data;
        setMessageList(responseMessageList);
      } catch (error) {
        console.error(error);
        setError("Error in showing chat List");
      }
    };
    handelRender();
  }, [navigate]);
  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {messageList.map((message, index) => (
        <div key={index}>
          <SingleSideChat message={message} />
        </div>
      ))}
    </>
  );
};

export default ChatList;
