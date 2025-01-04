export interface MessageDisplayProps {
  otherUserId: string;
}

export interface IMessage {
  content: string;
  senderId: string;
  receiverId: string;
  sender: string;
  receiver: string;
  createdAt: Date;
}

export interface IMessages {
  content: IMessage[];
  errors: string;
}
