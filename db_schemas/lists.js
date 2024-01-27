const mongoose = require("mongoose");

// Schema for User Documents
const listSchema = new mongoose.Schema({
  id: { type: String, required: false },
  userID: { type: String, required: false },
  title: { type: String, required: false },
  createDate: { type: Date, required: false },
  icon: { type: String, required: false },
  tasks: [{ type: String, required: false }],
});

const TaskList = mongoose.model("List", listSchema);

module.exports = TaskList;
