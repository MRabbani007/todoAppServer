const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express();
// Import User Functions

// Router for client requests
const userRouter = require("./userRouter");
const listRouter = require("./listRouter");
const taskRouter = require("./taskRouter");

// Handle user registration and authentication
router.use("/user", userRouter);

// Verify JWT Middleware applies to website content
router.use(verifyJWT);

router.use("/lists", listRouter);
router.use("/tasks", taskRouter);

module.exports = router;
