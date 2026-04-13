const EmergencyContact = require("../models/EmergencyContact");

const getContacts = async (req, res) => {
  const contacts = await EmergencyContact.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(contacts);
};

const addContact = async (req, res) => {
  const { name, phone, email, contactName, phoneNumber } = req.body;
  const safeName = contactName || name;
  const safePhone = phoneNumber || phone;
  if (!safeName || (!safePhone && !email)) {
    return res.status(400).json({ message: "Name and phone/email are required" });
  }
  const contact = await EmergencyContact.create({
    userId: req.userId,
    contactName: safeName,
    phoneNumber: safePhone || "N/A",
    email,
  });
  return res.status(201).json(contact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...(req.body.contactName || req.body.name ? { contactName: req.body.contactName || req.body.name } : {}),
    ...(req.body.phoneNumber || req.body.phone
      ? { phoneNumber: req.body.phoneNumber || req.body.phone }
      : {}),
    ...(req.body.email !== undefined ? { email: req.body.email } : {}),
  };
  const updated = await EmergencyContact.findOneAndUpdate(
    { _id: id, userId: req.userId },
    payload,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Contact not found" });
  return res.json(updated);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deleted = await EmergencyContact.findOneAndDelete({ _id: id, userId: req.userId });
  if (!deleted) return res.status(404).json({ message: "Contact not found" });
  return res.json({ message: "Contact deleted" });
};

module.exports = { getContacts, addContact, updateContact, deleteContact };
