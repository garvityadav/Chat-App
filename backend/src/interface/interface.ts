import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  friendRequests: IFriendRequest[];
  contacts: IContact[];
  isActive: boolean;
  sentMessage: [];
  receivedMessage: [];
}
export interface IContact {
  id?: string;
  userId: string;
  contactId: string;
  username: string;
  isBlocked: boolean;
  isUnfriend: boolean;
  createdAt: Date;
  favorite: boolean;
}

export interface IMessage {
  id?: string;
  content: string;
  senderId: string;
  receiverId: string;
  read?: boolean;
  sent?: boolean;
  sender: IUser | { id: string; username: string };
  receiver: IUser | { id: string; username: string };
  createdAt: Date;
}
export interface CustomRequest extends Request {
  user: JwtPayload;
}

export interface IJsonResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  errors?: { field?: string; details: string }[];
  meta?: Record<string, any>;
}

export interface IFriendRequest {
  id?: string;
  userId: string;
  contactId: string;
  accepted: string;
  rejected: string;
  createdAt: Date;
}
