const supplierService = require("../services/supplierService");
const catchAsync = require("../utils/catchAsync");

const createSupplier = catchAsync(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.user.company_id, req.body);
  res.status(201).json(supplier);
});

const listSuppliers = catchAsync(async (req, res) => {
  const suppliers = await supplierService.listSuppliers(req.user.company_id);
  res.json(suppliers);
});

const requestSupplierData = catchAsync(async (req, res) => {
  const result = await supplierService.requestSupplierData(req.user.company_id, Number(req.params.id));
  res.json(result);
});

module.exports = {
  createSupplier,
  listSuppliers,
  requestSupplierData,
};
