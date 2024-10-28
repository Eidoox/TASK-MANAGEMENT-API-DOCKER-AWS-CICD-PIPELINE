const redis = require("redis");

let redisClient;

const connectRedis = async () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      socket: {
        host: "redis",
        port: 6379,
      },
    });

    // Connect to Redis
    redisClient.on("connect", () => {
      console.log("Connected to Redis successfully.");
    });

    redisClient.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    await redisClient.connect();
  }

  return redisClient;
};

module.exports = connectRedis;
