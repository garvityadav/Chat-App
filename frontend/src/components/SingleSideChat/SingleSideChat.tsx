import { useGlobalContext } from "../../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";

interface IContactList {
  contactId: string;
  id: string;
  content: string;
  username: string;
  read: boolean;
  createdAt: Date;
}

const SingleSideChat = ({ message }: { message: IContactList }) => {
  const navigate = useNavigate();
  const globalContext = useGlobalContext();
  const setContactId = globalContext ? globalContext.setContactId : null;
  return (
    <div style={{ backgroundColor: "grey", padding: "10px" }}>
      <button
        type='button'
        onClick={() => {
          navigate("/profile");
        }}
        style={{}}
      >
        {message.username}
      </button>
      <div
        onClick={() => {
          if (setContactId) setContactId(message.contactId);
          navigate("/main");
        }}
      >
        <p>Message: {message.content}...</p>
      </div>
    </div>
  );
};

export default SingleSideChat;
