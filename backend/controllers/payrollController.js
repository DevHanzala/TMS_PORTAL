import Payroll from "../models/payrollModel.js";

export const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll();
    res.status(200).json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    res.status(500).json({ message: "Failed to fetch payrolls" });
  }
};

export const createPayrolls = async (req, res) => {
  try {
    const payrollsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdPayrolls = await Payroll.bulkCreate(payrollsData, { validate: true });
    res.status(201).json(createdPayrolls);
  } catch (error) {
    console.error("Error creating payrolls:", error);
    res.status(400).json({ message: "Failed to create payrolls", error: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid payroll ID" });
    }

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Update only the fields provided in the request body
    await payroll.update(req.body, { fields: Object.keys(req.body) });
    res.status(200).json(payroll);
  } catch (error) {
    console.error("Error updating payroll:", error);
    res.status(400).json({ message: "Failed to update payroll", error: error.message });
  }
};

export const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findByPk(id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    await payroll.destroy();
    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    console.error("Error deleting payroll:", error);
    res.status(500).json({ message: "Failed to delete payroll" });
  }
};

export const deleteAllPayrolls = async (req, res) => {
  try {
    await Payroll.destroy({ where: {}, truncate: true });
    res.status(200).json({ message: "All payrolls deleted successfully" });
  } catch (error) {
    console.error("Error deleting all payrolls:", error);
    res.status(500).json({ message: "Failed to delete all payrolls" });
  }
};