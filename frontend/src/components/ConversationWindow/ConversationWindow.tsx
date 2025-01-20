//here the message is displayed

import { useEffect, useState } from "react";
import axios from "axios";
import { IMessage } from "../../types/message.types";
import SingleChat from "../SingleChat/SingleChat";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ConversationWindow: React.FC<{
  userId: string;
  contactId: string;
}> = ({ userId, contactId }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [error, setError] = useState<string>("");
  const [log, setLog] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLog(`userId ='${userId}', contactId = '${contactId}'`);
        if (userId && contactId) {
          const response = await axios.get(
            `${backendUrl}/api/v1/messaging/conversation/${contactId}`,
            { withCredentials: true }
          );
          if (response.data.status === 401) {
            navigate("/error/unauthorized");
          }
          setMessages(response.data.data);
        }
      } catch (error) {
        setError("Error loading conversations");
        console.log(error);
      }
    };
    fetchMessages();
  }, [userId, contactId, navigate]);

  return (
    <>
      <div
        style={{
          backgroundColor: contactId ? "white" : "black",
          border: contactId && userId ? "1px black solid" : "3px solid red",
          maxWidth: "1920px",
          maxHeight: "400px",
          overflow: "scroll",
        }}
      >
        {messages.map((message: IMessage, index: number) => (
          <div key={index}>
            <SingleChat message={message} />
          </div>
        ))}
      </div>

      {log && <p style={{ color: "black" }}>{log}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default ConversationWindow;
