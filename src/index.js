const express = require("express");
const app = express();
const connectToMongoDB = require("./config/MongoDB");
const connectRedis = require("./config/Redis");
const indexRouter = require("./routes/IndexRoutes");
const UsersAuthControllers = require("./controllers/UsersAuthControllers");
const taskController = require("./controllers/taskController");

require("dotenv").config();

app.use(express.json());

(async () => {
  try {
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    const redisClient = await connectRedis();
    console.log("Connected to Redis");

    app.set("redisClient", redisClient);

    // Pass the app to the controllers to set the redisClient globally
    UsersAuthControllers.setRedisClient(app);
    taskController.setRedisClient(app);

    app.use("/api/v1/", indexRouter);

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Error connecting to the server:", error);
  }
})();
