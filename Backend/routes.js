const express = require("express");
const { login, signup } = require("./modules/auth/controller");
const verifyToken = require("./middleware/auth");
const authorize = require("./middleware/roles");

const router = express.Router();

const { getActivityData, getSuppliers, getEmissionFactors, addActivity, addSupplier, addAuditLog } = require("./data");

const {
 calculateAll,
 calculateTotals
} = require("./ghgEngine");

// auth routes
router.post("/login", login);
router.post("/signup", signup);

// protected routes
// dashboard data - requires authentication
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const activityData = await getActivityData();
    const calculated = await calculateAll(activityData);
    const totals = calculateTotals(calculated);

    res.json({
      records: calculated,
      totals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/activities", verifyToken, async (req, res) => {
  try {
    const activity = await addActivity(req.body);
    const io = req.app.get('io');
    io.emit('activityAdded', activity);
    await addAuditLog({ action: 'add_activity', user_id: req.user.id, details: JSON.stringify(activity) });
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// supplier data - admin only
router.get("/suppliers", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const suppliers = await getSuppliers();
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/suppliers", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const supplier = await addSupplier(req.body);
    const io = req.app.get('io');
    io.emit('supplierAdded', supplier);
    await addAuditLog({ action: 'add_supplier', user_id: req.user.id, details: JSON.stringify(supplier) });
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// scenario simulation
router.post("/scenario", verifyToken, async (req, res) => {
  try {
    const percent = req.body.renewablePercent;
    const activityData = await getActivityData();
    const emissionFactors = await getEmissionFactors();

    // Find electricity activity (handle various formats like scope2_electricity)
    const electricity = activityData.find(
      d => d.activity_type && d.activity_type.toLowerCase().includes('electricity')
    );

    if (!electricity) {
      return res.json({
        emissionReduction: 0,
        newTotal: 0,
        message: "No electricity data found"
      });
    }

    const factor = emissionFactors.electricity?.factor;
    if (!factor) {
      return res.status(500).json({ message: "No emission factor for electricity" });
    }

    const currentEmission = electricity.value * factor;

    const reducedConsumption = electricity.value * (percent / 100);
    const reducedEmission = reducedConsumption * factor;

    const emissionReduction = currentEmission - reducedEmission;
    const newTotal = currentEmission - emissionReduction;

    res.json({
      emissionReduction: Math.round(emissionReduction),
      newTotal: Math.round(newTotal)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// report
router.get("/report", verifyToken, async (req, res) => {
  try {
    const activityData = await getActivityData();
    const calculated = await calculateAll(activityData);
    const totals = calculateTotals(calculated);

    res.json({
      company: "Demo Corp",
      totals,
      data: calculated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// notifications
const { getNotifications, markAsRead, clearNotifications, notify } = require("./modules/notifications/service");

router.get("/notifications", (req, res) => {
 res.json(getNotifications());
});

router.post("/notifications", (req, res) => {
 const { message } = req.body;
 if (!message) return res.status(400).json({ error: "Message required" });
 const notification = notify(message);
 res.json(notification);
});

router.put("/notifications/:id/read", (req, res) => {
 const notification = markAsRead(parseInt(req.params.id));
 if (notification) {
  res.json(notification);
 } else {
  res.status(404).json({ error: "Notification not found" });
 }
});

router.delete("/notifications", (req, res) => {
 clearNotifications();
 res.json({ message: "Notifications cleared" });
});

// emissions AI endpoints
const { predictScope3, getAnomalies } = require("./modules/emissions/controller");

router.post("/emissions/predict-scope3", verifyToken, predictScope3);
router.get("/emissions/anomalies", verifyToken, getAnomalies);

module.exports = router;