const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handleRefreshToken,
  handleGetUsers,
  handleUserPassword,
  handleUserGetProfile,
  handleUserEditProfile,
} = require("../controllers/userControllers");
const User = require("../db_schemas/user");
const verifyJWT = require("../middleware/verifyJWT");
const userRouter = express();

// Signup Request
userRouter.post("/register", handleSignUp);

// Signin Request
userRouter.post("/auth", handleSignIn);

// Signout Request
userRouter.post("/logout", handleSignOut);

// Refresh Access Token
userRouter.get("/refresh", handleRefreshToken);

userRouter.use(verifyJWT);
userRouter.route("/admin").get(verifyRoles(5150), handleGetUsers);

userRouter
  .route("/profile")
  .get(verifyRoles(2001), handleUserGetProfile)
  .patch(verifyRoles(2001), handleUserEditProfile);

userRouter.route("/pwd").post(verifyRoles(2001), handleUserPassword);

userRouter.get("/*", async (req, res) => {
  const data = await User.find({});
  res.json("Server Running");
});

module.exports = userRouter;
