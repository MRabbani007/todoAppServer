const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getTasksList,
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../controllers/taskControllers");
const taskRouter = express();

taskRouter.route("/main").post(createTask).patch(updateTask).delete(deleteTask);

taskRouter.route("/").post(getTasks);

module.exports = taskRouter;
