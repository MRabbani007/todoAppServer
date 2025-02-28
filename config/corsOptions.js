const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "HEAD", "PATCH", "POST", "DELETE", "OPTIONS"],
  origin: ["https://mrabbani007.github.io", "http://localhost:5173"], // Allow only frontend
  credentials: true, // Allow cookies/sessions
  allowedHeaders: ["Content-Type", "Authorization"],
  // preflightContinue: false,
  // keepHeaderOnError: true,
  // headers: ["Content-Type", "Authorization", "Origin", "Accept"],
};

module.exports = corsOptions;
