//  MongoDB connection via mongoose
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(`${__dirname}/config/.env`) });
mongoose.set("strictQuery", false);

// TODO: change MongoDB DB/Collection
// const uri = `mongodb+srv://mrabbani:06DQsFrGxILSxaJ6@todoapp.hygd0ma.mongodb.net/todoApp?retryWrites=true&w=majority`;

const uri = process.env.ATLAS_URI;

// Connect to Mongoose
const Main = async () => {
  //process.env.MONGODB_URI
  await mongoose
    .connect(uri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then((dbo) => {
      // console.log("mongodb connected");
    })
    .catch(() => {
      // console.log("Mongo.js: failed");
    });
};

Main().catch((err) => console.log(err));
