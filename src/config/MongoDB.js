const mongoose = require("mongoose");

const DATABASE_URL = "mongodb://eidoox:eidoox99@mongo:27017/tasks_database";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
  } catch (error) {
    console.log("Error happened while connecting to mongodb");
    throw error;
  }
};

module.exports = connectToMongoDB;
