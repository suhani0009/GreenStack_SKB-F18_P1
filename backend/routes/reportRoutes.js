const express = require("express");

const reportController = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/generate", reportController.generateReport);

module.exports = router;
