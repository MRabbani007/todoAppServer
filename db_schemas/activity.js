const mongoose = require("mongoose");

// Schema for User Documents
const activitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userID: { type: String, required: true },
  ownername: { type: String, required: true },
  shared: { type: Boolean, required: false, default: false },
  teams: { type: [String], required: false, default: [] },
  title: { type: String, required: false, default: "" },
  detail: { type: String, required: false, default: "" },
  color: { type: String, required: false, default: "green" },
  icon: { type: String, required: false, default: "" },
  time: { type: String, required: false },
  completed: { type: Boolean, required: false },
  dueDate: { type: Date, required: false },
  completedDate: { type: Date, required: false },
  createDate: { type: Date, required: false, default: new Date() },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
