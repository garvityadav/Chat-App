//here the message is displayed

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IMessage } from "../../types/message.types";
import SingleChat from "../SingleChat/SingleChat";
import { useNavigate } from "react-router-dom";
import IsTyping from "../IsTyping/IsTyping";
import { ConversationWrapper } from "./ConversationWindowStyles";
import { useSocket } from "../../contexts/ExportingContexts";
import { IsTypingStyle } from "../IsTyping/IsTypingStyle";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface IData {
  senderId: string;
  receiverId: string;
  message: string;
  error: boolean;
  createdAt: number;
}
const ConversationWindow: React.FC<{
  userId: string;
  contactId: string;
}> = ({ userId, contactId }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [error, setError] = useState<string>("");
  const [log, setLog] = useState("");
  const [typing, setTyping] = useState(false);
  const socket = useSocket();
  const conversationRef = useRef<HTMLDivElement>(null);
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

  // append new socket chat with previous chat

  // for typing indicator
  useEffect(() => {
    const handleTyping = (data: { senderId: string; receiverId: string }) => {
      if (data) setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 3000);
    };
    const handleReceiveMessages = (data: IData) => {
      const { message, senderId, receiverId, error } = data;

      setMessages([...messages, message]);
    };

    socket?.on("receive_message", hanelReceiveMessages);
    socket?.on("contact_typing", handleTyping);
    return () => {
      socket?.off("contact_typing", handleTyping);
      socket?.off("receive_message");
    };
  }, [socket]);

  //scroll to the latest conversation

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages, typing]);
  return (
    <>
      <ConversationWrapper ref={conversationRef}>
        {typing && (
          <IsTypingStyle>
            <IsTyping />
          </IsTypingStyle>
        )}
        {messages.map((message: IMessage, index: number) => (
          <div key={index}>
            <SingleChat message={message} />
          </div>
        ))}
      </ConversationWrapper>

      {log && <p style={{ color: "black" }}>{log}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default ConversationWindow;
