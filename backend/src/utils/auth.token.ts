import jwt, { JwtPayload } from "jsonwebtoken";

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY || "";
const jwtExpireTime = process.env.JWT_EXPIRE_TIME || "1d";
export interface TokenPayload {
  userId: string;
  role: ["user", "admin"];
}
export const createToken = async (
  payload: TokenPayload
): Promise<string | null> => {
  try {
    if (!jwtPrivateKey) {
      throw new Error("JWT secret is not defined");
    }
    const jwtSign = jwt.sign(payload, jwtPrivateKey, {
      algorithm: "HS256",
      expiresIn: jwtExpireTime,
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
    if (!jwtPrivateKey) {
      throw new Error("JWT secret is not defined");
    }
    const isVerified = jwt.verify(token, jwtPrivateKey, {
      algorithms: ["RS256"],
    });
    return isVerified;
  } catch (error) {
    console.error("Token verification failed: ", error);
    return null;
  }
};
