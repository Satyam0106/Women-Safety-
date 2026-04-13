const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { predictCrime } = require("../controllers/crimeController");

const router = express.Router();

router.use(authMiddleware);
router.post("/", predictCrime);

module.exports = router;
