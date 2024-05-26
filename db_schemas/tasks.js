const mongoose = require("mongoose");

// Schema for User Documents
const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userID: { type: String, required: true },
  listID: { type: String, required: false, default: "task_list" },
  title: { type: String, required: false, default: "" },
  details: { type: String, required: false, default: "" },
  priority: { type: String, required: false, default: "low" },
  tags: { type: [String], required: false, default: [] },
  createDate: { type: Date, required: false, default: new Date() },
  dueDate: { type: Date, required: false },
  dueTime: { type: String, required: false },
  completed: { type: Boolean, required: false, default: false },
  trash: { type: Boolean, required: false, default: false },
  trashDate: { type: Date, required: false },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
