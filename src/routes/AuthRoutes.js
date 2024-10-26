const express = require("express");
const authRouter = express.Router();
const authenticateUser = require("../middlewares/AuthenticationMiddleware");

const {
  usersRegisteration,
  usersLogin,
  getCurrentProfile,
} = require("../controllers/UsersAuthControllers");

authRouter.post("/register", usersRegisteration);
authRouter.post("/login", usersLogin);
router.get("/me", authenticateUser, getCurrentProfile);

module.exports = authRouter;
