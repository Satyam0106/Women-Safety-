const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getHistory } = require("../controllers/historyController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getHistory);

module.exports = router;
