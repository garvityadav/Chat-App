export interface Iuser {
  id: string;
  email: string;
  username: string;
  password: string;
  sentMessage: [];
  receivedMessage: [];
}

export interface IMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  sender: string;
  receiver: string;
  createdAt: Date;
}
