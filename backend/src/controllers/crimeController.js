const LocationHistory = require("../models/LocationHistory");
const IncidentLog = require("../models/IncidentLog");
const { runCrimePrediction } = require("../services/crimePredictorService");

const predictCrime = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const prediction = await runCrimePrediction({ latitude, longitude });

    const historyEntry = await LocationHistory.create({
      userId: req.userId,
      latitude,
      longitude,
      crimeRiskScore: prediction.crimeRiskScore,
      riskLevel: prediction.riskLevel,
      analysis: prediction.analysis,
      timestamp: new Date(),
    });

    await IncidentLog.create({
      userId: req.userId,
      eventType: "ALERT",
      latitude,
      longitude,
      riskLevel: prediction.riskLevel,
      details: prediction.analysis,
    });

    return res.status(201).json({
      ...prediction,
      historyId: historyEntry._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Prediction failed", error: error.message });
  }
};

module.exports = { predictCrime };
