//here the message is displayed

import { useEffect, useState } from "react";
import axios from "axios";
import { IMessage } from "../types/message.types";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ConversationDisplay: React.FC<{
  userId: string;
  contactId: string;
}> = ({ userId }: { userId: string }, { contactId }: { contactId: string }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (userId && contactId) {
          const response = await axios.post(
            `${backendUrl}/api/v1/conversation/${contactId}`
          );
          setMessages(response.data);
        }
      } catch (error) {
        setError("Error loading conversations");
        console.log(error);
      }
    };
    fetchMessages();
  }, [userId, contactId]);

  return (
    <>
      <div>
        {messages.map((message: IMessage, index: number) => (
          <li key={index}>
            <p>{message.content}</p>
          </li>
        ))}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default ConversationDisplay;
