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
  sortTasks,
  sortTasksPlanner,
} = require("../controllers/taskControllers");
const taskRouter = express();

taskRouter
  .route("/main")
  .get(getTasks)
  .post(createTask)
  .patch(updateTask)
  .delete(deleteTask);

taskRouter.route("/sort").patch(sortTasks);
taskRouter.route("/sortPlanner").patch(sortTasksPlanner);

taskRouter
  .route("/tag")
  .post(addTaskTag)
  .patch(updateTaskTag)
  .delete(deleteTaskTag);

taskRouter.route("/summary").get(getTaskSummary);

module.exports = taskRouter;
