// controllers/exEmployeeController.js
import ExEmployee from "../models/exEmployeeModel.js";

// Fetch all ex-employees
export const getExEmployees = async (req, res) => {
  try {
    const exEmployees = await ExEmployee.findAll();
    const exEmployeesWithImages = exEmployees.map((exEmployee) => ({
      ...exEmployee.toJSON(),
      image: exEmployee.image ? `data:image/jpeg;base64,${exEmployee.image.toString("base64")}` : null,
    }));
    res.status(200).json(exEmployeesWithImages);
  } catch (error) {
    console.error("Fetch ex-employees error:", error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete an ex-employee by ID
export const deleteExEmployee = async (req, res) => {
  try {
    const exEmployee = await ExEmployee.findByPk(req.params.id);
    if (!exEmployee) return res.status(404).json({ message: "Ex-employee not found" });

    await exEmployee.destroy();
    res.status(200).json({ message: "Ex-employee deleted successfully" });
  } catch (error) {
    console.error("Delete ex-employee error:", error.stack);
    res.status(500).json({ message: "Error deleting ex-employee", error: error.message });
  }
};