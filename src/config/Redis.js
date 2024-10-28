const redis = require("redis");

const connectRedis = async () => {
  const redisClient = redis.createClient({
    url: "redis://redis:6379",
  });

  // Connect to Redis
  redisClient.on("connect", () => {
    console.log("Connected to Redis successfully.");
  });

  redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  await redisClient.connect();

  return redisClient;
};

module.exports = { connectRedis };
