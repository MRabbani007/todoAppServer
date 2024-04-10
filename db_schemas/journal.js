const mongoose = require("mongoose");

// Schema for User Documents
const journalSchema = new mongoose.Schema({
  id: { type: String, required: false },
  userID: { type: String, required: false },
  title: { type: String, required: false },
  detail: { type: String, required: false },
  planDate: { type: String, required: false },
  onDate: { type: String, required: false },
  timeFrom: { type: String, required: false },
  timeTo: { type: String, required: false },
  createDate: { type: Date, required: false },
});

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
