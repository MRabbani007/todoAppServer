const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getLists,
  createList,
  updateList,
  deleteList,
  sortLists,
} = require("../controllers/listControllers");
const { getListSummary } = require("../controllers/taskControllers");
const listRouter = express();

listRouter
  .route("/main")
  .get(verifyRoles(2001), getLists)
  .post(verifyRoles(2001), createList)
  .patch(verifyRoles(2001), updateList)
  .delete(verifyRoles(2001), deleteList);

listRouter.route("/sort").patch(verifyRoles(2001), sortLists);

listRouter.route("/summary").post(verifyRoles(2001), getListSummary);

module.exports = listRouter;
