import { useCallback, useState } from "react";
import { useSocket } from "../../contexts/ExportingContexts";
import { debounce } from "lodash";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface IData {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: number;
}
interface ITyping {
  senderId: string;
  receiverId: string;
}

const TypingSpace: React.FC<{ userId: string; contactId: string }> = ({
  userId,
  contactId,
}) => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTyping = useCallback(() => {
    if (socket && userId && contactId) {
      const typingData: ITyping = { senderId: userId, receiverId: contactId };

      debounce(() => {
        socket.timeout(5000).emit("user_typing", typingData);
      }, 500)();
    }
  }, [socket, userId, contactId]);

  const saveMessageToDatabase = async (data: IData) => {
    try {
      await axios.post(`${backendUrl}/api/v1/sendMessage`, data);
    } catch (error) {
      console.error(error);
      setError("Error saving message to the database");
    }
  };

  const handlingSendingMessages = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    if (socket && userId && contactId) {
      if (message.trim() !== "") {
        const sendMessage = {
          senderId: userId,
          receiverId: contactId,
          content: message,
          error: false,
          createdAt: Date.now(),
        };
        try {
          if (message && contactId) {
            await saveMessageToDatabase(sendMessage);
            socket.timeout(5000).emit("send_message", sendMessage);
            setIsLoading(false);
            setMessage("");
          } else {
            setError("Error sending message , please retry");
            sendMessage.error = true;
            socket.timeout(5000).emit("send_message", sendMessage);
            setMessage("");
          }
        } catch (error) {
          console.error(error);
          setError("Error sending message");
          setIsLoading(false);
        }
      }
    }
  };
  return (
    <div style={{ display: "grid" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type='text'
        id='messageInput'
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        value={message}
        placeholder={
          contactId
            ? "Type message here ..."
            : "Click a user to start conversation"
        }
        aria-label='Message input'
        disabled={contactId ? false : true}
      />
      <button
        type='submit'
        onClick={handlingSendingMessages}
        disabled={isLoading}
      >
        Send
      </button>
    </div>
  );
};

export default TypingSpace;
