const express = require("express");
const authRouter = require("./AuthRoutes");
const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);

module.exports = indexRouter;
