const reportService = require("../services/reportService");
const catchAsync = require("../utils/catchAsync");

const generateReport = catchAsync(async (req, res) => {
  const report = await reportService.generateReport(req.user.company_id, {
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    scope: req.query.scope,
  });

  res.json(report);
});

module.exports = {
  generateReport,
};
