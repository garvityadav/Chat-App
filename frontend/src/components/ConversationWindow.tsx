//here the message is displayed

import { useEffect, useState } from "react";
import axios from "axios";
import { IMessage } from "../types/message.types";
import { useMainPageContext } from "../contexts/MainPageContexts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MessageDisplay = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState<string>("");
  const useContext = useMainPageContext();
  const contactId = useContext ? useContext.contactId : null;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!contactId) {
          setError("user id not found");
        }
        const response = await axios.post(
          `${backendUrl}/api/v1/conversation/${contactId}`
        );
        setMessages(response.data);
      } catch (error) {
        setError("Error loading conversations");
        console.log(error);
      }
    };
    fetchMessages();
  }, [contactId]);

  return (
    <>
      <div>
        {messages.map((message: IMessage, index: number) => (
          <div key={index}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default MessageDisplay;
