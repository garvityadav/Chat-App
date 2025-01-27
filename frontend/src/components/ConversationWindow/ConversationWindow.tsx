//here the message is displayed

import { useEffect, useRef, useState } from "react";
import SingleChat from "../SingleChat/SingleChat";
import IsTyping from "../IsTyping/IsTyping";
import { ConversationWrapper } from "./ConversationWindowStyles";
import { useSocket, useGlobalContext } from "../../contexts/ExportingContexts";
import { IsTypingStyle } from "../IsTyping/IsTypingStyle";
import { IMessage } from "../ChatWindowBox/ChatWindowBox";

export interface IContact {
  id?: string;
  favorite: boolean;
  userId: string;
  contactId: string;
  username: string;
  isBlocked: boolean;
  isUnfriend: boolean;
}

const ConversationWindow: React.FC<{
  username: string;
  contactId: string;
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}> = ({ messages, contactId, username, setMessages }) => {
  const [typing, setTyping] = useState(false);
  const { userUsername } = useGlobalContext();
  const socket = useSocket();
  const conversationRef = useRef<HTMLDivElement>(null);

  // to fetch the messages from database
  // for typing indicator
  useEffect(() => {
    const handleTyping = (data: { senderId: string; receiverId: string }) => {
      if (data) setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 3000);
    };
    socket?.on("contact_typing", handleTyping);
    return () => {
      socket?.off("contact_typing", handleTyping);
    };
  }, [socket]);

  // append new socket chat with previous chat
  useEffect(() => {
    const handleReceiveMessages = (data: IMessage) => {
      const { content, senderId, receiverId, error, createdAt } = data;

      setMessages([
        ...messages,
        { content, senderId, receiverId, createdAt, error },
      ]);
    };

    socket?.on("receive_message", handleReceiveMessages);
    return () => {
      socket?.off("receive_message", handleReceiveMessages);
    };
  }, [socket, messages, setMessages]);

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
            <SingleChat
              message={message}
              username={message.senderId == contactId ? username : userUsername}
            />
          </div>
        ))}
      </ConversationWrapper>
    </>
  );
};

export default ConversationWindow;
