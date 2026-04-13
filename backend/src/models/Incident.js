const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, default: "" },
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    message: { type: String, default: "SOS triggered" },
    notifiedContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "EmergencyContact" }],
    status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
