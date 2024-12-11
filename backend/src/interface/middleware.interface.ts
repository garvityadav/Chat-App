import { Request } from "express";
import { TokenPayload } from "./token.interface";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: TokenPayload | JwtPayload;
}
