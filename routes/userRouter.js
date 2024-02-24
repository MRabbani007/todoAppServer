const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handleRefreshToken,
  handleGetUsers,
  handleUserGetSettings,
  handleUserEditSettings,
  handleUserPassword,
} = require("../controllers/userControllers");
const userRouter = express();

// Signup Request
userRouter.post("/register", handleSignUp);

// Signin Request
userRouter.post("/auth", handleSignIn);

// Signout Request
userRouter.post("/logout", handleSignOut);

// Refresh Access Token
userRouter.get("/refresh", handleRefreshToken);

userRouter.route("/admin").post(verifyRoles(5150), handleGetUsers);

userRouter
  .route("/settings")
  .post(verifyRoles(2001), handleUserGetSettings)
  .put(verifyRoles(2001), handleUserEditSettings);

userRouter.route("/pwd").post(verifyRoles(2001), handleUserPassword);

userRouter.post("/*", (req, res) => {
  console.log(req.params.name);
  res.json("Server Running");
});

module.exports = userRouter;
