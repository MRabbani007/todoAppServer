const mongoose = require("mongoose");

// Schema for User Documents
const journalSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userID: { type: String, required: true },

    title: { type: String, required: false, default: "" },
    task: { type: String, required: false, default: "" },
    detail: { type: String, required: false, default: "" },
    notes: { type: String, required: false, default: "" },

    color: { type: String, required: false, default: "green" },

    planDate: { type: String, required: false },
    onDate: { type: Date, required: false, default: new Date() },

    timeFrom: { type: String, required: false },
    timeTo: { type: String, required: false },

    createDate: { type: Date, required: false, default: new Date() },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
