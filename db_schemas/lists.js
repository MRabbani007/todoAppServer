const mongoose = require("mongoose");

// Schema for User Documents
const listSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userID: { type: String, required: true },

    title: { type: String, required: false, default: "" },
    slug: { type: String, required: false, default: "" },

    subTitle: { type: String, required: false, default: "" },
    detail: { type: String, required: false, default: "" },

    status: { type: String, required: false, default: "" },
    type: { type: String, required: false, default: "" },

    // createDate: { type: Date, required: false, default: new Date() },
    // updateDate: { type: Date, required: false, default: new Date() },

    icon: { type: String, required: false, default: "" },
    banner: { type: String, required: false, default: "" },
    tasks: { type: [String], required: false }, // remove
    pinned: { type: Boolean, required: false, default: false },

    sortIndex: { type: Number, required: false, default: 0 },

    trash: { type: Boolean, required: false, default: false },
    trashDate: { type: Date, required: false },
  },
  { timestamps: true }
);

const TaskList = mongoose.model("List", listSchema);

module.exports = TaskList;
