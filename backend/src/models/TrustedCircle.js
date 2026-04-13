const mongoose = require("mongoose");

const trustedCircleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    memberName: { type: String, required: true },
    relationship: { type: String, default: "" },
    phoneNumber: { type: String, required: true },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrustedCircle", trustedCircleSchema);
