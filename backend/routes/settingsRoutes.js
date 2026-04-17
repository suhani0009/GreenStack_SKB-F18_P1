const express = require("express");

const settingsController = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(settingsController.getSettings).put(settingsController.updateSettings);

module.exports = router;
