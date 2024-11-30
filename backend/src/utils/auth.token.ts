import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

const jwtSecret = process.env.JWTSECRET || "";

export const createToken = async (
  payload: ObjectId
): Promise<string | null> => {
  try {
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }
    const jwtSign = jwt.sign(payload, jwtSecret, {
      algorithm: "RS256",
      expiresIn: "1d",
    });
    return jwtSign;
  } catch (error) {
    console.error("token creation failed", error);
    return null;
  }
};

export const verifyToken = async (
  token: string
): Promise<JwtPayload | string | null> => {
  try {
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }
    const isVerified = jwt.verify(token, jwtSecret, {
      algorithms: ["RS256"],
    });
    return isVerified;
  } catch (error) {
    console.error("Token verification failed: ", error);
    return null;
  }
};
