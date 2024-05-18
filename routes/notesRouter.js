const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const {
  getNotes,
  createNote,
  editNote,
  deleteNote,
} = require("../controllers/noteControllers");

const notesRouter = express();

notesRouter
  .route("/main")
  .get(getNotes)
  .post(createNote)
  .patch(editNote)
  .delete(deleteNote);

module.exports = notesRouter;
