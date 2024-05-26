const mongoose = require("mongoose");

// Schema for User Documents
const listSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userID: { type: String, required: true },
  title: { type: String, required: false, default: "" },
  status: { type: String, required: false, default: "" },
  type: { type: String, required: false, default: "" },
  createDate: { type: Date, required: false, default: new Date() },
  icon: { type: String, required: false, default: "" },
  tasks: { type: [String], required: false },
  trash: { type: Boolean, required: false, default: false },
  trashDate: { type: Date, required: false },
});

const TaskList = mongoose.model("List", listSchema);

module.exports = TaskList;
