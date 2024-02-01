const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(`${__dirname}/config/.env`) });
const app = express();
// Connect to mongodb
require("./mongoose");
// Router for client requests
const router = require("./router");
const userRouter = require("./routes/userRoutes");
const listRouter = require("./routes/listRoutes");
const taskRouter = require("./routes/taskRoutes");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRouter);
app.use("/lists", listRouter);
app.use("/tasks", taskRouter);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
