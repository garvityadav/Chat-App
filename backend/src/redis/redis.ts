import { createClient } from "redis";

const password = process.env.REDIS_PASSWORD;
const username = process.env.REDIS_USERNAME;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
if (!password || !username || !redisHost || !redisPort) {
  throw new Error("Please provide all the redis credential");
}

export const redisClient = createClient({
  username: username,
  password: password,
  socket: {
    host: redisHost,
    port: Number(redisPort),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const redisInitializeConnection = async () => {
  try {
    await redisClient.connect();
    console.log("Successfully connected to redis");
    await redisClient.set("foo", "bar");
    const result = await redisClient.get("foo");
    console.log(result); // >>> bar
  } catch (error) {
    console.log(`error connecting to redis server `, error);
    process.exit(1);
  }
};
