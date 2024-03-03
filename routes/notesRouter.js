const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const { handleNotes } = require("../controllers/noteControllers");

const notesRouter = express();

notesRouter.post("/getNotes", handleNotes);

module.exports = notesRouter;
