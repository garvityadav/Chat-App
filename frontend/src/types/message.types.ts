export interface IMessage {
  id?: string;
  content: string;
  senderId: string;
  receiverId: string;
  sender: { id: string; username: string };
  receiver: { id: string; username: string };
  createdAt: Date;
}
