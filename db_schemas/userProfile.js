const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },

    firstname: { type: String, required: false, default: "" },
    lastname: { type: String, required: false, default: "" },
    profileEmail: { type: String, required: false, default: "" },
    bio: { type: String, required: false, default: "" },
    profileImage: { type: String, required: false, default: "" },
    phoneNumber: { type: String, required: false, default: "" },
    city: { type: String, required: false, default: "" },
    country: { type: String, required: false, default: "" },
    careerTrade: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
