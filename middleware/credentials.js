const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  // console.log("Credentials");
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  // console.log("Credentials passed");
  next();
};

module.exports = credentials;
