// ////////////////////////////////////////
// // Here there will be the list of all the user's friends
// ////////////////////////////////////////

import { useEffect, useState } from "react";
import SingleSideChat from "./SingleSideChat";
import axios from "axios";
import { IMessage } from "../types/message.types";
import { useGlobalContext } from "../contexts/GlobalContext";
// import { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ChatList = () => {
  const [messageList, setMessageList] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [recentChat, setRecentChat] = useState("");
  const [contactId, setContactId] = useState("");
  const [unreadMessageCounter, setUnreadMessageCounter] = useState(0);

  const userContext = useGlobalContext();
  const userId = userContext?.userId;
  useEffect(() => {
    setError("");
    const handelRender = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/messaging/messages`
        );
        if (!response) {
          setError("Error retrieving messages");
        }
        const responseMessageList: IMessage[] = response.data.data;
        const filterMessage = (messages: IMessage[]) => {
          //filter out single recent message based on contactId
        };
        setMessageList(responseMessageList);
      } catch (error) {
        console.error(error);
        setError("Problem in showing chat List");
      }
    };
    handelRender();
  }, []);
  return <></>;
};

export default ChatList;
