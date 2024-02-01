const express = require("express");
const userRouter = express();
const {
  signUpUser,
  signInUser,
  getUserID,
} = require("../functions/userFunctions");

userRouter.get("/", async (req, res) => {
  res.json("Get User");
});

userRouter.post("/", async (req, res) => {
  res.json("Get User");
});

// Signin Request
userRouter.post("/signin", async (req, res) => {
  // TODO: Implement Signin
  let result = "";
  // get username and password from client
  let clientusername = req.body.username;
  let clientpassword = req.body.password;
  console.log("Signin Request", clientusername, clientpassword);
  result = (await signInUser(clientusername, clientpassword)) || "error";
  res.json(result);
});

// Signup Request
userRouter.post("/signup", async (req, res) => {
  // TODO: Implement Signup
  let result = "";
  // get username and password from client
  let clientusername = req.body.username;
  let clientpassword = req.body.password;
  console.log("Signup Request", clientusername, clientpassword);
  result = await signUpUser(clientusername, clientpassword);
  res.json(result);
});

module.exports = userRouter;
