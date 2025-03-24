import { create } from "zustand";
import axios from "axios";
import { payrollSchema } from "../Scheema/payrollScheema";

const API_URL = "http://localhost:5000/api/payrolls";

export const usePayrollStore = create((set) => ({
  payrollData: [],
  loading: false,
  error: null,

  fetchPayrolls: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ payrollData: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch payrolls", loading: false });
    }
  },

  createPayrolls: async (payrolls) => {
    set({ loading: true, error: null });
    try {
      const validatedPayrolls = payrolls.map((payroll) => payrollSchema.parse(payroll));
      const response = await axios.post(API_URL, validatedPayrolls);
      set((state) => ({
        payrollData: [...state.payrollData, ...response.data],
        loading: false,
      }));
      return { success: true, message: "Payrolls created successfully", data: response.data };
    } catch (error) {
      set({ error: error.message || "Failed to create payrolls", loading: false });
      return { success: false, message: error.message || "Failed to create payrolls" };
    }
  },

  updatePayroll: async (id, updatedPayroll) => {
    set({ loading: true, error: null });
    try {
      if (!id) throw new Error("Payroll ID is required for update");
      const validatedPayroll = payrollSchema.parse(updatedPayroll);
      const response = await axios.put(`${API_URL}/${id}`, validatedPayroll);
      set((state) => ({
        payrollData: state.payrollData.map((p) => (p.id === id ? response.data : p)),
        loading: false,
      }));
      return { success: true, message: "Payroll updated successfully" };
    } catch (error) {
      set({ error: error.message || "Failed to update payroll", loading: false });
      return { success: false, message: error.message || "Failed to update payroll" };
    }
  },

  deletePayroll: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        payrollData: state.payrollData.filter((p) => p.id !== id),
        loading: false,
      }));
      return { success: true, message: "Payroll deleted successfully" };
    } catch (error) {
      set({ error: error.message || "Failed to delete payroll", loading: false });
      return { success: false, message: error.message || "Failed to delete payroll" };
    }
  },

  deleteAllPayrolls: async () => {
    set({ loading: true, error: null });
    try {
      await axios.delete(API_URL);
      set({ payrollData: [], loading: false });
      return { success: true, message: "All payrolls deleted successfully" };
    } catch (error) {
      set({ error: error.message || "Failed to delete all payrolls", loading: false });
      return { success: false, message: error.message || "Failed to delete all payrolls" };
    }
  },
}));
