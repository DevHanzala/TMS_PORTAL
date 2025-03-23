import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/exemployees";

export const useExEmployeeStore = create((set) => ({
  exEmployees: [],
  loading: false,
  error: null,

  // Fetch all ex-employees
  fetchExEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ exEmployees: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch ex-employees",
        loading: false,
      });
    }
  },

  // Delete an ex-employee
  deleteExEmployee: async (exEmployeeId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${exEmployeeId}`);
      set((state) => ({
        exEmployees: state.exEmployees.filter((exEmployee) => exEmployee.id !== exEmployeeId),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting ex-employee",
        loading: false,
      });
      return false;
    }
  },
}));