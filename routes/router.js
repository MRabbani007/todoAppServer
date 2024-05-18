const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express();

// Routers for client requests
const userRouter = require("./userRouter");
const listRouter = require("./listRouter");
const taskRouter = require("./taskRouter");
const tagRouter = require("./tagRouter");
const notesRouter = require("./notesRouter");
const journalRouter = require("./journalRouter");

// Handle user registration and authentication
router.use("/user", userRouter);

// Verify JWT Middleware applies to website content
// router.use(verifyJWT);

router.use("/lists", listRouter);
router.use("/tasks", taskRouter);
router.use("/tags", tagRouter);
router.use("/notes", notesRouter);
router.use("/journal", journalRouter);

module.exports = router;
