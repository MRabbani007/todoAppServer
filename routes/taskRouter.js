const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  addTaskTag,
  updateTaskTag,
  deleteTaskTag,
  getTaskSummary,
} = require("../controllers/taskControllers");
const taskRouter = express();

taskRouter.route("/main").post(createTask).patch(updateTask).delete(deleteTask);

taskRouter
  .route("/tag")
  .post(addTaskTag)
  .patch(updateTaskTag)
  .delete(deleteTaskTag);

taskRouter.route("/get").post(getTasks);
taskRouter.route("/summary").post(getTaskSummary);

module.exports = taskRouter;
