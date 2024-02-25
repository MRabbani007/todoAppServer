const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  handleLists,
  handleListSummary,
} = require("../controllers/contentControllers");
const listRouter = express();

listRouter.route("/get").post(verifyRoles(2001), handleLists);
listRouter.route("/create").post(verifyRoles(2001), handleLists);
listRouter.route("/update").post(verifyRoles(2001), handleLists);
listRouter.route("/remove").post(verifyRoles(2001), handleLists);

// listRouter.post("/add", handleLists);
// listRouter.post("/edit", handleLists);
// listRouter.post("/remove", handleLists);
listRouter.post("/summary", handleListSummary);

module.exports = listRouter;
