const mongoose = require("mongoose");

// Schema for User Documents
const noteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userID: { type: String, required: true },

    title: { type: String, required: false, default: "" },
    details: { type: String, required: false, default: "" },

    priority: { type: String, required: false, default: "" },
    pinned: { type: Boolean, required: false, default: false },
    sortIndex: { type: Number, required: false, default: 0 },

    isOpen: { type: Boolean, required: false, default: true },
    tags: { type: [String], required: false },

    dueDate: { type: Date, required: false },
    trash: { type: Boolean, required: false, default: false },
    trashDate: { type: Date, required: false },

    // createDate: { type: Date, required: false, default: new Date() },
    // updateDate: { type: Date, required: false, default: new Date() },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
