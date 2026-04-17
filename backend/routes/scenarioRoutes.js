const express = require("express");

const scenarioController = require("../controllers/scenarioController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/simulate", scenarioController.simulateScenario);

module.exports = router;
