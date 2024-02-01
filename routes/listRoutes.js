const express = require("express");
const listRouter = express();
const {
  signUpUser,
  signInUser,
  getUserID,
} = require("../functions/userFunctions");
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
} = require("../functions/taskFunctions");

//
listRouter.post("/get", async (req, res) => {
  let result = null;
  let userName = req.body.userName;
  let userID = await getUserID(userName);
  console.log("Get Lists:", userName);
  result = await getUserLists(userID);
  res.json(result);
});

//
listRouter.post("/create", async (req, res) => {
  let userName = req.body.userName;
  let list = req.body.list;
  console.log("Create List:", list);
  let userID = await getUserID(userName);
  let result = await createList(userID, list);
  res.json(result);
});

//
listRouter.post("/update", async (req, res) => {
  try {
    let userName = req.body.userName;
    let listID = req.body.listID;
    let updateData = req.body.updateData;
    console.log("Update List:", updateData);
    let userID = await getUserID(userName);
    let result = await updateList(userID, listID, updateData);
    res.json(result);
  } catch (error) {
    res.status(500).json("Server Error");
  }
});

// Delete List
listRouter.post("/remove", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  console.log("Remove List:", userName, listID);
  let userID = await getUserID(userName);
  let response = await removeList(userID, listID);
  res.json(response);
});

module.exports = listRouter;
