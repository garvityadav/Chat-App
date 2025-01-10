import { useState } from "react";
import { socket } from "../socket";
import { useGlobalContext } from "../contexts/GlobalContext";
import { useMainPageContext } from "../contexts/MainPageContexts";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface IData {
  message: string;
  receiverId: string;
}

const TypingSpace = () => {
  const globalContext = useGlobalContext();
  const mainPageContext = useMainPageContext();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = globalContext?.userId;
  const contactId = mainPageContext?.contactId;

  const handleTyping = () => {
    if (userId && contactId) {
      socket
        .timeout(5000)
        .emit("user_typing", { senderId: userId, receiverId: contactId });
    }
  };
  const saveMessageToDatabase = async (data: IData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/sendMessage`,
        data
      );
      if (!response) {
        console.error("axios response error ");
        setError("axios error");
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handlingSendingMessages = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    if (message.trim() !== "") {
      const sendMessage = {
        senderId: userId,
        receiverId: contactId,
        content: message,
        createdAt: Date.now(),
      };
      try {
        const response = await socket
          .timeout(5000)
          .emitWithAck("send_message", sendMessage);
        setIsLoading(false);
        if (response.status === "success") {
          if (message && contactId) {
            const data = {
              message: message,
              receiverId: contactId,
            };
            await saveMessageToDatabase(data);
            setMessage("");
          }
        }

        //check if the socket.io can help saving the message else uncomment following:
      } catch (error) {
        console.error(error);
        setError("Error sending message");
        return;
      }
    }
  };
  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type='text'
        id='messageInput'
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        value={message}
        placeholder='Type message here ...'
      />
      <button
        type='submit'
        onSubmit={handlingSendingMessages}
        disabled={isLoading}
      >
        Send
      </button>
    </>
  );
};

export default TypingSpace;
