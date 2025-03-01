const mongoose = require("mongoose");

// Schema for User Documents
const listSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userID: { type: String, required: true },

    title: {
      type: String,
      required: false,
      default: "",
      trim: true,
      maxlength: [100, "TaskList title cannot exceed 100 characters"],
    },
    slug: { type: String, required: false, default: "" },

    subTitle: { type: String, required: false, default: "" },
    detail: {
      type: String,
      required: false,
      default: "",
      trim: true,
      maxlength: [500, "TaskList description cannot exceed 500 characters"],
    },

    status: { type: String, required: false, default: "" },
    type: { type: String, required: false, default: "" },
    display: { type: String, required: false, default: "" },

    // createDate: { type: Date, required: false, default: new Date() },
    // updateDate: { type: Date, required: false, default: new Date() },

    icon: { type: String, required: false, default: "" },
    banner: { type: String, required: false, default: "" },

    pinned: { type: Boolean, required: false, default: false },

    sortIndex: { type: Number, required: false, default: 0 },

    trash: { type: Boolean, required: false, default: false },
    trashDate: { type: Date, required: false },
  },
  { timestamps: true }
);

const TaskList = mongoose.model("List", listSchema);

module.exports = TaskList;
