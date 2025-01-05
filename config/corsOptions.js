const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // allowedOrigins: allowedOrigins,
  optionsSuccessStatus: 200,
  methods: ["GET", "HEAD", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  // preflightContinue: false,
  // keepHeaderOnError: true,
  // headers: ["Content-Type", "Authorization", "Origin", "Accept"],
};

module.exports = corsOptions;
