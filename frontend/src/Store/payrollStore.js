import { create } from "zustand";
import axios from "axios";

const usePayrollStore = create((set) => ({
  payrollData: [],
  fetchPayrollData: async (fileId) => {
    if (!fileId) return;

    try {
      const response = await axios.get(`/api/files/${fileId}`);
      const csvText = response.data.filedata;

      if (!csvText) {
        console.error("Empty file data received.");
        return;
      }

      // Convert CSV to JSON
      const rows = csvText.trim().split("\n").slice(1);
      const payrollData = rows
        .map((row) => {
          const values = row.split(",").map((val) => val.trim());
          if (values.length !== 5) return null; // Ensure correct column count

          const [employee_name, employee_id, salary, department, month] = values;
          return { employee_name, employee_id, salary, department, month };
        })
        .filter(Boolean); // Remove null values

      set({ payrollData });
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
  },
}));

export default usePayrollStore;
