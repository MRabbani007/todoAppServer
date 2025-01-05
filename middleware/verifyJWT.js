const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    // console.log("Failed: No JWT header");
    return res.sendStatus(401); // unauthorized
  }
  const token = authHeader.split(" ")[1];
  // const token = req.cookies.jwt;
  // if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.sendStatus(403);
    } // forbiden: invalid Token
    req.user = {
      username: decoded?.username || null,
      roles: decoded?.roles || [],
    };
    next();
  });
};

module.exports = verifyJWT;
