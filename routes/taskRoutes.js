const express = require("express");
const taskRouter = express();
const { getUserID } = require("../functions/userFunctions");
const {
  getListTasks,
  addTask,
  removeTask,
  updateTask,
  getTasksToday,
  getTasksWeek,
} = require("../functions/taskFunctions");

taskRouter.post("/", async (req, res) => {
  res.json("task functions");
});

taskRouter.post("/getList", async (req, res) => {
  try {
    let userName = req.body.userName;
    let listID = req.body.listID;
    let userID = await getUserID(userName);
    console.log("Get Tasks:", listID);
    let result = await getListTasks(userID, listID);
    res.json(result);
  } catch (error) {
    console.log("Error: Get Tasks List");
    res.json("Error: Get Tasks List");
  }
});

taskRouter.post("/getToday", async (req, res) => {
  try {
    let userName = req.body.userName;
    let day = req.body.day;
    let userID = await getUserID(userName);
    console.log("Get Tasks Today:", userName);
    let result = await getTasksToday(userID, day);
    res.json(result);
  } catch (error) {
    console.log("Error: Get Tasks Today");
    res.json("Error: Get Tasks Today");
  }
});

taskRouter.post("/getWeek", async (req, res) => {
  try {
    let userName = req.body.userName;
    let day = req.body.day;
    let offset = req.body.offset;
    let userID = await getUserID(userName);
    console.log("Get Tasks Week:", userName);
    let result = await getTasksWeek(userID, day, offset);
    res.json(result);
  } catch (error) {
    console.log("Error: Get Tasks Week");
    res.json("Error: Get Tasks Week");
  }
});

//
taskRouter.post("/create", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  let taskTitle = req.body.taskTitle;
  let userID = await getUserID(userName);
  console.log("Add Task:", taskTitle);
  let result = await addTask(userID, listID, taskTitle);
  res.json(result);
});

taskRouter.post("/remove", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  let taskID = req.body.taskID;
  let userID = await getUserID(userName);
  console.log("Remove Task:", taskID);
  let result = await removeTask(userID, listID, taskID);
  res.json(result);
});

taskRouter.post("/update", async (req, res) => {
  let userName = req.body.userName;
  let updateData = req.body.updateData;
  console.log("Update Task:", updateData.updateItem, updateData.newValue);
  let result = (await updateTask(userName, updateData)) || [];
  res.json(result);
});

module.exports = taskRouter;
