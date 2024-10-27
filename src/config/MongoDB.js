const mongoose = require("mongoose");

const DATABASE_URL = "mongodb://eidoox:eidoox99@mongo:27017";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "tasks_database",
    });
  } catch (error) {
    console.log("Error happened while connecting to mongodb");
    throw error;
  }
};

module.exports = connectToMongoDB;
