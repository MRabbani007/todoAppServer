const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getTagsAll,
  getTagsTask,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagControllers");
const tagRouter = express();

tagRouter.post("/getAll", getTagsAll);
tagRouter.post("/getTask", getTagsTask);
tagRouter.post("/create", createTag);
tagRouter.post("/update", updateTag);
tagRouter.post("/remove", deleteTag);

module.exports = tagRouter;
