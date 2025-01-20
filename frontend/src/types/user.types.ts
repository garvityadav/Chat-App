import { IContact } from "./contact.types";

export interface TypingSpaceProps {
  contactId: string;
}

export interface IUser {
  email: string;
  username: string;
  password: string;
  contacts: IContact[];
  isActive: boolean;
  sentMessage: [];
  receivedMessage: [];
}
