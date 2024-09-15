const mongoose = require("mongoose");

// Schema for User Documents
const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userID: { type: String, required: true },
    listID: { type: String, required: false, default: "task_list" },

    title: { type: String, required: false, default: "" },
    details: { type: String, required: false, default: "" },

    priority: { type: String, required: false, default: "low" },
    priorityLevel: { type: Number, required: false, default: 1 },

    sortIndex: { type: Number, required: false, default: 0 },
    plannerSortIndex: { type: Number, required: false, default: 0 },

    tags: [
      {
        id: { type: Number, default: 0 },
        name: { type: String, required: false, default: "" },
      },
    ],

    createDate: { type: Date, required: false, default: new Date() },
    dueDate: { type: Date, required: false },
    prevDueDate: { type: Date, required: false },

    dueTime: { type: String, required: false },
    completed: { type: Boolean, required: false, default: false },

    status: { type: String, required: false, default: "open" },
    trash: { type: Boolean, required: false, default: false },
    trashDate: { type: Date, required: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
