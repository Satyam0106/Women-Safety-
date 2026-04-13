const Incident = require("../models/Incident");
const EmergencyContact = require("../models/EmergencyContact");
const { getRiskLevel } = require("../utils/riskIndicator");

const triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const contacts = await EmergencyContact.find({ userId: req.userId });
    const riskLevel = getRiskLevel(latitude, longitude);

    const incident = await Incident.create({
      user: req.userId,
      location: { latitude, longitude, address: address || "" },
      riskLevel,
      message: `Emergency SOS triggered at ${new Date().toLocaleString()}`,
      notifiedContacts: contacts.map((c) => c._id),
    });

    return res.status(201).json({
      message: "SOS sent successfully",
      incident,
      notifiedContacts: contacts,
      riskLevel,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to trigger SOS", error: error.message });
  }
};

const getIncidents = async (req, res) => {
  const incidents = await Incident.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(incidents);
};

module.exports = { triggerSOS, getIncidents };
