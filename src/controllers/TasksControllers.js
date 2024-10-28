const { default: mongoose } = require("mongoose");
const taskModel = require("../models/TaskModel");
// create task for authenticated user
const createTask = async (req, res) => {
  try {
    const { description } = req.body;
    const { redisClient } = req;

    const task = new taskModel({
      userId: req.user.userId,
      description,
    });

    await task.save();

    // Invalidate the cache for the user's tasks to ensure freshness
    const cacheKey = `userTasks:${req.user.userId}`;
    await redisClient.del(cacheKey);

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
    const { redisClient } = req;
    const cacheKey = `userTasks:${req.user.userId}`;

    // Step 1: Check if the user's tasks are in the cache
    const cachedTasks = await redisClient.get(cacheKey);

    console.log("sssss", cachedTasks);
    if (cachedTasks) {
      // if cache hits
      return res.status(200).json({
        message: "User tasks retrieved successfully from cache",
        tasks: JSON.parse(cachedTasks),
      });
    }

    const tasks = await taskModel
      .find({ userId: req.user.userId })
      .select("-userId");

    await redisClient.set(cacheKey, JSON.stringify(tasks), "EX", 60 * 60); // set expiration to 1 hour

    return res.status(200).json({
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
    const { redisClient } = req;

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

    // Invalidate the cache for the user's tasks to ensure freshness
    const cacheKey = `userTasks:${req.user.userId}`;
    await redisClient.del(cacheKey);

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
    const { redisClient } = req;

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

    // Invalidate the cache for the user's tasks to ensure freshness
    const cacheKey = `userTasks:${req.user.userId}`;
    await redisClient.del(cacheKey);

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getUserTasks,
  deleteUserTask,
  updateUserTask,
};
