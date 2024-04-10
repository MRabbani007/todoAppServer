const mongoose = require("mongoose");

// Schema for User Documents
const tagSchema = new mongoose.Schema({
  id: { type: String, required: false },
  userID: { type: String, required: false },
  listID: { type: String, required: false },
  taskID: { type: String, required: false },
  name: { type: String, required: false },
  createDate: { type: Date, required: false },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
