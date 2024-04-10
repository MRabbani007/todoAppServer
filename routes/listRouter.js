const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getLists,
  createList,
  updateList,
  deleteList,
} = require("../controllers/listControllers");
const { getListSummary } = require("../controllers/taskControllers");
const listRouter = express();

listRouter.route("/get").post(verifyRoles(2001), getLists);
listRouter.route("/create").post(verifyRoles(2001), createList);
listRouter.route("/update").post(verifyRoles(2001), updateList);
listRouter.route("/remove").post(verifyRoles(2001), deleteList);

listRouter.post("/summary", getListSummary);

module.exports = listRouter;
