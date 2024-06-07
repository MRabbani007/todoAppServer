const mongoose = require("mongoose");

// Schema for User Documents
const activityTaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  activityID: { type: String, required: true },
  userID: { type: String, required: true, unique: false },
  responsible: { type: String, required: false },
  title: { type: String, required: false, default: "" },
  detail: { type: String, required: false, default: "" },
  color: { type: String, required: false, default: "green" },
  time: { type: String, required: false },
  completed: { type: Boolean, required: false },
  dueDate: { type: String, required: false },
  completedDate: { type: Date, required: false, default: new Date() },
  completedBy: { type: String, required: false, default: "" },
  createDate: { type: Date, required: false, default: new Date() },
});

const ActivityTask = mongoose.model("ActivityTask", activityTaskSchema);

module.exports = ActivityTask;
