import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
const jwtAccessKey = process.env.JWT_PRIVATE_ACCESS_KEY || "";
const jwtRefreshKey = process.env.JWT_PRIVATE_REFRESH_KEY || "";
const jwtAccessExpireTime = process.env.JWT_ACCESS_EXPIRE_TIME || "1d";
const jwtRefreshExpireTime = process.env.JWT_REFRESH_EXPIRE_TIME || "7d";

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
export interface ICustomPayload extends JwtPayload {
  id: string;
}

const createAccessToken = (payload: ICustomPayload): string => {
  return jwt.sign(payload, jwtAccessKey, {
    algorithm: "HS256",
    expiresIn: jwtAccessExpireTime,
  });
};

const createRefreshToken = (payload: ICustomPayload): string => {
  return jwt.sign(payload, jwtRefreshKey, {
    algorithm: "HS256",
    expiresIn: jwtRefreshExpireTime,
  });
};
export const createToken = async (
  payload: ICustomPayload
): Promise<ITokens> => {
  try {
    if (!jwtAccessKey || !jwtRefreshKey) {
      throw new Error("JWT refresh or access key is not defined");
    }

    if (!jwtAccessExpireTime || !jwtRefreshExpireTime) {
      throw new Error("JWT expire time not provided");
    }
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);
    const token: ITokens = {
      accessToken,
      refreshToken,
    };
    return token;
  } catch (error) {
    console.error("token creation failed", error);
    throw new Error("Token creation failed");
  }
};

const verifyAccessToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, jwtAccessKey, { algorithms: ["HS256"] });
    return payload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      console.error("access token expired");
    }
  }
};

export const verifyToken = async (
  accessToken: string,
  refreshToken: string,
  res: Response
): Promise<ICustomPayload | null> => {
  try {
    //1. verify the access token
    const decodedPayload = jwt.verify(
      accessToken,
      jwtAccessKey
    ) as ICustomPayload;
    return decodedPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      console.log("Access token expired , Verifying refresh token...");
      try {
        // 2. verify refresh token
        const decodedRefresh = jwt.verify(
          refreshToken,
          jwtRefreshKey
        ) as ICustomPayload;

        // 3. Create new access token
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id },
          jwtAccessKey,
          { algorithm: "HS256", expiresIn: jwtAccessExpireTime }
        );
        res.cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, //15 min
        });
        console.log("new access_token cookie created");
        return decodedRefresh;
      } catch (refreshError) {
        console.error("Refresh token verification failed", refreshError);
        throw new Error("Refresh token is invalid or expired");
      }
    } else {
      console.error("Access Token verification failed: ", error);
      throw new Error("Access Token verification failed");
    }
  }
};
