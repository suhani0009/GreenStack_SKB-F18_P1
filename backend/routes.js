const express = require("express");
const { login } = require("./modules/auth/controller");
const verifyToken = require("./middleware/auth");
const authorize = require("./middleware/roles");

const router = express.Router();

const { activityData, suppliers } =
 require("./data");

const {
 calculateAll,
 calculateTotals
} = require("./ghgEngine");

// auth routes
router.post("/login", login);

// protected routes
// dashboard data - requires authentication
router.get("/dashboard", verifyToken, (req, res) => {
 const calculated =
  calculateAll(activityData);

 const totals =
  calculateTotals(calculated);

 res.json({
  records: calculated,
  totals
 });
});


// supplier data - admin only
router.get("/suppliers", verifyToken, authorize(["admin"]), (req, res) => {

 res.json(suppliers);
});


// scenario simulation
router.post("/scenario", (req, res) => {

 const percent =
  req.body.renewablePercent;

 const electricity =
  activityData.find(
   d => d.activity_type === "electricity"
  );

 const reduced =
  electricity.value * (percent / 100);

 const reducedEmission =
  reduced * 0.1;

 res.json({
  reduction: reducedEmission
 });
});


// report
router.get("/report", (req, res) => {

 const calculated =
  calculateAll(activityData);

 const totals =
  calculateTotals(calculated);

 res.json({
  company: "Demo Corp",
  totals,
  data: calculated
 });
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

module.exports = router;