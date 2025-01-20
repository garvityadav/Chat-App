export interface IMessage {
  id?: string;
  content: string;
  senderId: string;
  receiverId: string;
  sender: string;
  receiver: string;
  createdAt: Date;
}
