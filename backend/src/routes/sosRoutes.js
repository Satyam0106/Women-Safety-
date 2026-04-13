const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { triggerSOS, getIncidents } = require("../controllers/sosController");

const router = express.Router();

router.use(authMiddleware);
router.post("/trigger", triggerSOS);
router.get("/incidents", getIncidents);

module.exports = router;
