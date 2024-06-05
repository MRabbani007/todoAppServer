const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const DB_URI = process.env.DATABASE_URI;

    if (!DB_URI) throw new Error("Database URL Not Found");

    await mongoose.connect(DB_URI, {
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
