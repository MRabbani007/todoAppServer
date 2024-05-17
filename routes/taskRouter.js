const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getTasksList,
  createTask,
  updateTask,
  deleteTask,
  getTasksToday,
  getTasksWeek,
  getTasksImportant,
  getTasksOverDue,
  getTasksAll,
  deleteTags,
} = require("../controllers/taskControllers");
const taskRouter = express();

taskRouter.post("/getToday", getTasksToday);
taskRouter.post("/getWeek", getTasksWeek);
taskRouter.post("/getImportant", getTasksImportant);
taskRouter.post("/getOverdue", getTasksOverDue);

taskRouter
  .route("/main")
  .get(getTasksList)
  .post(createTask)
  .patch(updateTask)
  .delete(deleteTask);

taskRouter.post("/deleteAllTags", deleteTags);

// for Admin
taskRouter.post("/getAll", getTasksAll);

module.exports = taskRouter;
