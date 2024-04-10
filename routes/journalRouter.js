const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalControllers");
const journalRouter = express();

journalRouter.post("/get", getJournal);
journalRouter.post("/create", createJournal);
journalRouter.post("/update", updateJournal);
journalRouter.post("/delete", deleteJournal);

module.exports = journalRouter;
