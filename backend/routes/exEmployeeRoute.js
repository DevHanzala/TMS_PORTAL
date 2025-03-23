// routes/exEmployeeRoute.js
import express from "express";
import { getExEmployees, deleteExEmployee } from "../controllers/exEmployeeController.js";

const router = express.Router();

// Routes
router.get("/", getExEmployees); // Fetch all ex-employees
router.delete("/:id", deleteExEmployee); // Delete an ex-employee by ID

export default router;