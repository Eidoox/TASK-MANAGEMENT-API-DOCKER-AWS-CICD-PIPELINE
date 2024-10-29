const express = require("express");
const app = express();
const connectToMongoDB = require("./config/MongoDB");
const { connectRedis } = require("./config/Redis");
const indexRouter = require("./routes/IndexRoutes");

require("dotenv").config();

app.use(express.json());

(async () => {
  try {
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    const redisClient = await connectRedis();
    app.set("redisClient", redisClient);

    app.use((req, res, next) => {
      req.redisClient = redisClient;
      next();
    });

    app.get("/", (req, res) => {
      res.send("Welcoe to my nodeappppppppp");
    });

    app.use("/api/v1/", indexRouter);

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Error connecting to the server:", error);
  }
})();
