import TypingSpace from "../ChatInputBox/TypingSpace";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import ChatWindowHeader from "../ChatWindowHeader/ChatWindowHeader";
import { ChatWindowBoxStyles } from "./ChatWindowBoxStyles";
import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import ConversationWindow, {
  IContact,
} from "../ConversationWindow/ConversationWindow";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
export interface IMessage {
  id?: string;
  content: string;
  senderId: string;
  receiverId: string;
  sender?: { id: string; username: string };
  error?: boolean;
  receiver?: { id: string; username: string };
  createdAt: Date;
}
const ChatWindow = ({
  contactId,
  setContactId,
}: {
  contactId: string;
  setContactId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { userId } = useGlobalContext();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isContact, setIsContact] = useState(false);
  const [contact, setContact] = useState<IContact>();

  const navigate = useNavigate();
  //fetching messages

  useEffect(() => {
    const checkContact = async () => {
      try {
        const responseContact = await axios.get(
          `${backendUrl}/user/contacts?contactId=${contactId}`,
          { withCredentials: true }
        );
        setContact(responseContact.data.data);
        setIsContact(true);
      } catch (error) {
        console.log(error);
        setIsContact(false);
      }
    };
    const fetchMessages = async () => {
      try {
        if (userId && contactId) {
          const responseMessages = await axios.get(
            `${backendUrl}/messaging/conversation/${contactId}`,
            { withCredentials: true }
          );
          if (responseMessages.data.status === 401) {
            navigate("/error/unauthorized");
          }
          const { messages } = responseMessages.data.data;
          setMessages(messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkContact();
    fetchMessages();
  }, [userId, contactId, navigate]);

  return (
    <ChatWindowBoxStyles>
      {(!isContact && (
        <>
          <div>
            <p>Unknown</p>
          </div>
        </>
      )) || <h3>{contact?.username}</h3>}
      {(!isContact && (
        <div>
          <p>This user is not in your contact list</p>
          <button
            onClick={() => {
              navigate("/contact/update");
            }}
            type='button'
          >
            Add User
          </button>
        </div>
      )) || <button type='button'>Edit Contact</button>}

      <button
        type='button'
        onClick={() => {
          setContactId("");
        }}
      >
        Close Chat
      </button>
      <ChatWindowHeader />
      {messages && (
        <ConversationWindow
          username={contact ? contact.username : "unknown"}
          messages={messages}
          contactId={contactId}
          setMessages={setMessages}
        />
      )}
      {contact && contact.isBlocked ? (
        "User not available"
      ) : (
        <TypingSpace userId={userId} contactId={contactId} />
      )}
    </ChatWindowBoxStyles>
  );
};

export default ChatWindow;
