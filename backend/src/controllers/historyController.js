const LocationHistory = require("../models/LocationHistory");

const getHistory = async (req, res) => {
  try {
    const history = await LocationHistory.find({ userId: req.userId }).sort({ timestamp: -1 });
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load history", error: error.message });
  }
};

module.exports = { getHistory };
