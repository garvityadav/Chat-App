import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface Iuser {
  email: string;
  username: string;
  password: string;
  sentMessage: [];
  receivedMessage: [];
}

export interface IMessage {
  content: string;
  senderId: string;
  receiverId: string;
  sender: string;
  receiver: string;
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
