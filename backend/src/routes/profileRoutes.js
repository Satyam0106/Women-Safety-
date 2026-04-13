const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  addEmergencyContact,
  deleteEmergencyContact,
  addTrustedMember,
  deleteTrustedMember,
} = require("../controllers/profileController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", getProfile);
router.put("/update", updateProfile);
router.post("/contacts", addEmergencyContact);
router.delete("/contacts/:id", deleteEmergencyContact);
router.post("/trusted-circle", addTrustedMember);
router.delete("/trusted-circle/:id", deleteTrustedMember);

module.exports = router;
