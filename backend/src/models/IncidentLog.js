const mongoose = require("mongoose");

const incidentLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String, enum: ["ALERT", "RISK_EVENT"], default: "ALERT" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    riskLevel: { type: String, enum: ["Low", "Medium", "High"], required: true },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncidentLog", incidentLogSchema);
