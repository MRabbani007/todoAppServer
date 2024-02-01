const express = require("express");
const router = express();
// Import User Functions
const {
  signUpUser,
  signInUser,
  getUserID,
} = require("./functions/userFunctions");
const {
  createList,
  getUserLists,
  removeList,
  updateList,
  getListTasks,
  addTask,
  removeTask,
  updateTask,
  getTasksToday,
  getTasksWeek,
} = require("./functions/taskFunctions");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/", (req, res) => {
  res.json("Server Running");
});

router.post("/:page", (req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Running");
});

module.exports = router;
