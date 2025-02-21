const requiredEnv = [
  "DATABASE_URL",
  "PORT",
  "NODE_ENV",
  "JWT_PRIVATE_ACCESS_Key",
  "JWT_PRIVATE_REFRESH_Key",
  "JWT_ACCESS_EXPIRE_TIME",
  "JWT_REFRESH_EXPIRE_TIME",
  "ACCESS_COOKIE_EXPIRE_TIME",
  "REFRESH_COOKIE_EXPIRE_TIME",
  "FRONTEND_URL",
  "POSTMAN_URL",
  "SALT_ROUND",
] as const;

const missingVars = requiredEnv.filter((key) => {
  return !process.env[key];
});

if (missingVars.length > 0) {
  throw new Error(`missing required env variables:${missingVars.join(",")}`);
}

export const env = {
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV!,
  JWT_PRIVATE_ACCESS_KEY: process.env.JWT_PRIVATE_ACCESS_KEY!,
  JWT_PRIVATE_REFRESH_KEY: process.env.JWT_PRIVATE_REFRESH_KEY!,
  JWT_ACCESS_EXPIRE_TIME: process.env.JWT_ACCESS_EXPIRE_TIME!,

  JWT_REFRESH_EXPIRE_TIME: process.env.JWT_REFRESH_EXPIRE_TIME!,
  ACCESS_COOKIE_EXPIRE_TIME: process.env.ACCESS_COOKIE_EXPIRE_TIME!,

  REFRESH_COOKIE_EXPIRE_TIME: process.env.REFRESH_COOKIE_EXPIRE_TIME!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  POSTMAN_URL: process.env.POSTMAN_URL!,
  SALT_ROUND: process.env.SALT_ROUND!,
};
