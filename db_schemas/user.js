const mongoose = require("mongoose");

// Schema for User Documents
const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false, default: "" },

    firstname: { type: String, required: false, default: "" },
    lastname: { type: String, required: false, default: "" },

    email: { type: String, required: false, default: "", unique: true },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Editor: Number,
      Admin: Number,
    },
    createDate: { type: Date, required: false, default: new Date() },
    lastSigin: { type: Date, required: false },
    active: { type: Boolean, required: false, default: false },
    key: { type: String, required: false },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
