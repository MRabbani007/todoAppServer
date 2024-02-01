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
  res.json("get users");
});

// Signin Request
router.post("/signin", async (req, res) => {
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
router.post("/signup", async (req, res) => {
  // TODO: Implement Signup
  let result = "";
  // get username and password from client
  let clientusername = req.body.username;
  let clientpassword = req.body.password;
  console.log("Signup Request", clientusername, clientpassword);
  result = await signUpUser(clientusername, clientpassword);
  res.json(result);
});

//
router.post("/lists/get", async (req, res) => {
  let result = null;
  let userName = req.body.userName;
  let userID = await getUserID(userName);
  console.log("Get Lists:", userName);
  result = await getUserLists(userID);
  res.json(result);
});

//
router.post("/lists/create", async (req, res) => {
  let userName = req.body.userName;
  let list = req.body.list;
  console.log("Create List:", list);
  let userID = await getUserID(userName);
  let result = await createList(userID, list);
  res.json(result);
});

//
router.post("/lists/update", async (req, res) => {
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
router.post("/lists/remove", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  console.log("Remove List:", userName, listID);
  let userID = await getUserID(userName);
  let response = await removeList(userID, listID);
  res.json(response);
});

router.post("/tasks/getList", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  let userID = await getUserID(userName);
  console.log("Get Tasks:", listID);
  let result = await getListTasks(userID, listID);
  res.json(result);
});

router.post("/tasks/getToday", async (req, res) => {
  let userName = req.body.userName;
  let day = req.body.day;
  let userID = await getUserID(userName);
  console.log("Get Tasks Today:", userName);
  let result = await getTasksToday(userID, day);
  res.json(result);
});

router.post("/tasks/getWeek", async (req, res) => {
  let userName = req.body.userName;
  let day = req.body.day;
  let offset = req.body.offset;
  let userID = await getUserID(userName);
  console.log("Get Tasks Week:", userName);
  let result = await getTasksWeek(userID, day, offset);
  res.json(result);
});

// Handle Cart Requests
router.post("/tasks/create", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  let taskTitle = req.body.taskTitle;
  let userID = await getUserID(userName);
  console.log("Add Task:", taskTitle);
  let result = await addTask(userID, listID, taskTitle);
  res.json(result);
});

router.post("/tasks/remove", async (req, res) => {
  let userName = req.body.userName;
  let listID = req.body.listID;
  let taskID = req.body.taskID;
  let userID = await getUserID(userName);
  console.log("Remove Task:", taskID);
  let result = await removeTask(userID, listID, taskID);
  res.json(result);
});

router.post("/tasks/update", async (req, res) => {
  let userName = req.body.userName;
  let updateData = req.body.updateData;
  console.log("Update Task:", updateData.updateItem, updateData.newValue);
  let result = (await updateTask(userName, updateData)) || [];
  res.json(result);
});

module.exports = router;
