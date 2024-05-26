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
  getTasksTaskList,
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

taskRouter.route("/user").get(getTasksTaskList);

taskRouter.post("/deleteAllTags", deleteTags);

// get all user tasks
taskRouter.post("/getAll", getTasksAll);

module.exports = taskRouter;
