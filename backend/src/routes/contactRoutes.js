const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getContacts);
router.post("/", addContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
