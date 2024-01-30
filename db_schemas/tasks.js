const mongoose = require("mongoose");

// Schema for User Documents
const taskSchema = new mongoose.Schema({
  id: { type: String, required: false },
  userID: { type: String, required: false },
  listID: { type: String, required: false },
  title: { type: String, required: false },
  details: { type: String, required: false },
  priority: { type: String, required: false },
  tags: [{ type: String, required: false }],
  createDate: { type: Date, required: false },
  dueDate: { type: Date, required: false },
  dueTime: { type: String, required: false },
  completed: { type: Boolean, required: false },
  trash: { type: Boolean, required: false },
  trashDate: { type: Date, required: false },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
