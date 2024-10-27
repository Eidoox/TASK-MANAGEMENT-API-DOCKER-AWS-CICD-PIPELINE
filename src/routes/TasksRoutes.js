const express = require("express");
const taskRouter = express.Router();
const authenticateUser = require("../middlewares/AuthenticationMiddleware");

const {
  createTask,
  getUserTasks,
  deleteUserTask,
  updateUserTask,
} = require("../controllers/TasksControllers");

taskRouter.post("/", authenticateUser, createTask);
taskRouter.get("/", authenticateUser, getUserTasks);
taskRouter.delete("/:taskId", authenticateUser, deleteUserTask);
taskRouter.patch("/:taskId", authenticateUser, updateUserTask);

module.exports = taskRouter;
