const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const credentials = require("../middleware/credentials");
const corsOptions = require("../config/corsOptions");
const { logger } = require("../middleware/logEvents");
const cookieParser = require("cookie-parser");

const path = require("path");
require("dotenv").config({ path: path.resolve(`${__dirname}/config/.env`) });
const errorHandler = require("../middleware/errorHandler");

const app = express();

// Connect to mongodb
const connectDB = require("../config/dbConn");
// Router for client requests
const router = require("../routes/router");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS
// and check cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, Content-Length, X-Requested-With"
//   );
//   console.log("here");
//   //intercepts OPTIONS method
//   if ("OPTIONS" === req.method) {
//     console.log("options method");
//     //respond with 200
//     return res.sendStatus(200);
//   } else {
//     //move on
//     next();
//   }
// });

// app.options("/*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
//   );

//   console.log("set headers");

//   res.sendStatus(200);
// });

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use("/", router);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "../views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
