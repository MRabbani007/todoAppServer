const allowedOrigins = [
  "https://mrabbani007.github.io",
  "http://localhost:5173",
];

function corsHandler(req, res, next) {
  const origin = allowedOrigins.includes(req?.headers?.origin)
    ? req?.headers?.origin
    : "http://foo.io";

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    console.log("options method");
    //respond with 200
    return res.sendStatus(200);
  } else {
    //move on
    next();
  }
}

module.exports = { corsHandler };
