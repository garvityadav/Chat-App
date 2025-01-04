//here the messsage is displayed

import axios from "axios";
import { useEffect, useState } from "react";
import { axiosFetch } from "../utils/axios";
import { IMessages, MessageDisplayProps } from "../interfaces/interface";

function MessageDisplay(otherUserId: string): MessageDisplayProps {
  const { messages, setMessages } = useState([]);
  const { errors, setErrors } = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!otherUserId) {
          setErrors("user id not found");
        }
        const response = await axiosFetch(
          "get",
          `${process.env.BACKEND_URL}/api/v1/conversation/${otherUserId}`
        );
        setMessages(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [otherUserId]);

  return (
    <div>
      {messages.map((message: IMessages, index: number) => (
        <div key={index}>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}

export default MessageDisplay;
