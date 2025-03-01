const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express();

// Routers for client requests
const userRouter = require("./userRouter");
const listRouter = require("./listRouter");
const taskRouter = require("./taskRouter");
const tagRouter = require("./tagRouter");
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityControllers");
const {
  getActivityTasks,
  createActivityTask,
  updateActivityTask,
  deleteActivityTask,
} = require("../controllers/activityTaskControllers");
const {
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  getJournalTitles,
} = require("../controllers/journalControllers");
const {
  getNotes,
  createNote,
  editNote,
  deleteNote,
  sortNotes,
} = require("../controllers/noteControllers");

// Handle user registration and authentication
router.use("/user", userRouter);

// Verify JWT Middleware applies to website content
router.use(verifyJWT);

router.use("/lists", listRouter);
router.use("/tasks", taskRouter);
router.use("/tags", tagRouter);

router
  .route("/notes")
  .get(getNotes)
  .post(createNote)
  .patch(editNote)
  .delete(deleteNote);

router.route("/notes/sort").patch(sortNotes);

router
  .route("/journal")
  .get(getJournal)
  .post(createJournal)
  .patch(updateJournal)
  .delete(deleteJournal);

router.route("/journal/categories").get(getJournalTitles);

router
  .route("/activity")
  .get(getActivities)
  .post(createActivity)
  .patch(updateActivity)
  .delete(deleteActivity);

router
  .route("/activity/task")
  .get(getActivityTasks)
  .post(createActivityTask)
  .patch(updateActivityTask)
  .delete(deleteActivityTask);

router.route("/*").get((req, res) => {
  return res.json({ message: "Server Running" });
});

module.exports = router;
