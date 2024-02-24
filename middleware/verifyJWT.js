const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    // console.log("Failed: No JWT header");
    return res.sendStatus(401); // unauthorized
  }
  // console.log(authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      // console.log("Failed: JWT fail");
      return res.sendStatus(403);
    } // forbiden: invalid Token
    req.user = decoded.username;
    // console.log("JWT Passed");
    next();
  });
};

module.exports = verifyJWT;
