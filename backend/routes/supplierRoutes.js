const express = require("express");

const supplierController = require("../controllers/supplierController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/:id/request", supplierController.requestSupplierData);
router.route("/").post(supplierController.createSupplier).get(supplierController.listSuppliers);

module.exports = router;
