import { IMessage } from "../../types/message.types";

const SingleChat: React.FC<{
  message: IMessage;
}> = ({ message }) => {
  return (
    <div style={{ border: "2px solid black" }}>
      <p>{message.senderId}</p>
      <br />
      <p>Message: {message.content}</p>
    </div>
  );
};

export default SingleChat;
