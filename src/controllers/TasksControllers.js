const { default: mongoose } = require("mongoose");
const taskModel = require("../models/TaskModel");

let redisClient;

const setRedisClient = (app) => {
  redisClient = app.get("redisClient");
};

// create task for authenticated user
const createTask = async (req, res) => {
  try {
    const { description } = req.body;

    const task = new taskModel({
      userId: req.user.userId,
      description,
    });

    await task.save();

    res.status(201).json({
      message: "Task createdddd successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks for the authenticated user
const getUserTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find({ userId: req.user.userId })
      .select("-userId");

    res.status(200).json({
      message: "User tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a specific task by ID
const deleteUserTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Check if the taskId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Find the task and delete it
    const task = await taskModel.findOneAndDelete({
      _id: taskId,
      userId: req.user.userId,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized to delete" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a specific task by ID for the authenticated user
const updateUserTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { description, completed } = req.body;

    // Validate that the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Define the update fields (only update if the field is provided in the request)
    const updates = {};
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    // Find the task and update it if it belongs to the authenticated user

    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, userId: req.user.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized to update" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTask, getUserTasks, deleteUserTask, updateUserTask };
