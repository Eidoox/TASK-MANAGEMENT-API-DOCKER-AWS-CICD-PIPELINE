const express = require("express");
const authRouter = require("./AuthRoutes");
const taskRouter = require("./TasksRoutes");
const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/task", taskRouter);

module.exports = indexRouter;
