const mongoose = require("mongoose");

const locationHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    crimeRiskScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ["Low", "Medium", "High"], required: true },
    analysis: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LocationHistory", locationHistorySchema);
