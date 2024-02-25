const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const { handleTasks } = require("../controllers/contentControllers");
const taskRouter = express();

taskRouter.post("/getList", handleTasks);
taskRouter.post("/getToday", handleTasks);
taskRouter.post("/getWeek", handleTasks);
taskRouter.post("/getImportant", handleTasks);
taskRouter.post("/getOverdue", handleTasks);
taskRouter.post("/create", handleTasks);
taskRouter.post("/update", handleTasks);
taskRouter.post("/remove", handleTasks);

module.exports = taskRouter;
