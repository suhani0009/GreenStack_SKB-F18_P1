const express = require("express");

const emissionsController = require("../controllers/emissionsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/summary", emissionsController.getSummary);
router.route("/").post(emissionsController.createEmission).get(emissionsController.listEmissions);

module.exports = router;
