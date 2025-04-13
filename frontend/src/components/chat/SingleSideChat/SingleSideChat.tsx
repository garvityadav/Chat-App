import { useNavigate } from "react-router-dom";
import { IContactList } from "../ChatList/ChatList";

const SingleSideChat = ({
  setContactId,
  message,
}: {
  message: IContactList;
  setContactId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: message.isContact ? "grey" : "lightgoldenrodyellow",
        padding: "10px",
      }}
    >
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
