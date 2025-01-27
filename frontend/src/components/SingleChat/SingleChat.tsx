import { SingleChatStyle } from "./SingleChatStyles";
import { useGlobalContext } from "../../contexts/ExportingContexts";
import { IMessage } from "../ChatWindowBox/ChatWindowBox";
const SingleChat: React.FC<{
  message: IMessage;
  username: string;
}> = ({ message, username }) => {
  const { userId } = useGlobalContext();
  return (
    <SingleChatStyle
      $backgroundColor={
        userId == message.receiver?.id ? "lightgrey" : "lightgreen"
      } //received chat
      $borderRadius={
        userId == message.receiver?.id ? "23px 23px 0 23px" : "9px 9px 9px 0"
      }
      $order={userId == message.receiver?.id ? "2" : "1"}
      $textAlign={userId == message.receiver?.id ? "right" : "left"}
    >
      <p>{username}</p>
      <p>Message: {message.content}</p>
      {message.error && <p>Error sending message</p>}
    </SingleChatStyle>
  );
};

export default SingleChat;
