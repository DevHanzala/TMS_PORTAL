import express from "express";
import {
  getPayrolls,
  createPayrolls,
  updatePayroll,
  deletePayroll,
  deleteAllPayrolls,
} from "../controllers/payrollController.js";

const router = express.Router();

// Define payroll routes
router.get("/", getPayrolls);           // Fetch all payrolls
router.post("/", createPayrolls);       // Create payrolls (bulk or individual)
router.put("/:id", updatePayroll);      // Update a specific payroll
router.delete("/:id", deletePayroll);   // Delete a specific payroll
router.delete("/", deleteAllPayrolls);  // Delete all payrolls

export default router;