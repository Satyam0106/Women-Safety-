const User = require("../models/User");
const EmergencyContact = require("../models/EmergencyContact");
const TrustedCircle = require("../models/TrustedCircle");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    const emergencyContacts = await EmergencyContact.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    const trustedCircle = await TrustedCircle.find({ userId: req.userId }).sort({ createdAt: -1 });

    return res.json({ user, emergencyContacts, trustedCircle });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load profile", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileInfo } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(profileInfo ? { profileInfo } : {}),
      },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

const addEmergencyContact = async (req, res) => {
  try {
    const { contactName, phoneNumber, email } = req.body;
    if (!contactName || !phoneNumber) {
      return res.status(400).json({ message: "contactName and phoneNumber are required" });
    }
    const contact = await EmergencyContact.create({
      userId: req.userId,
      contactName,
      phoneNumber,
      email,
    });
    return res.status(201).json(contact);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add contact", error: error.message });
  }
};

const deleteEmergencyContact = async (req, res) => {
  try {
    const removed = await EmergencyContact.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!removed) return res.status(404).json({ message: "Contact not found" });
    return res.json({ message: "Contact deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete contact", error: error.message });
  }
};

const addTrustedMember = async (req, res) => {
  try {
    const { memberName, phoneNumber, relationship, email } = req.body;
    if (!memberName || !phoneNumber) {
      return res.status(400).json({ message: "memberName and phoneNumber are required" });
    }
    const member = await TrustedCircle.create({
      userId: req.userId,
      memberName,
      relationship,
      phoneNumber,
      email,
    });
    return res.status(201).json(member);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add trusted member", error: error.message });
  }
};

const deleteTrustedMember = async (req, res) => {
  try {
    const removed = await TrustedCircle.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!removed) return res.status(404).json({ message: "Trusted member not found" });
    return res.json({ message: "Trusted member deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete trusted member", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addEmergencyContact,
  deleteEmergencyContact,
  addTrustedMember,
  deleteTrustedMember,
};
