import { create } from "zustand";
import axios from "axios";
import z from "zod";
import { registerUserSchema } from "../Scheema/userScheema";

const API_URL = "http://localhost:5000/api/users";
const REGISTER_URL = `${API_URL}/upload`;

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  registerUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      console.log("🔍 Raw user data received:", userData);
      const validatedData = registerUserSchema.parse(userData);
      console.log("✅ Validated user data:", validatedData);

      const formData = new FormData();
      for (const key in validatedData) {
        if (key === "image" && validatedData[key] instanceof File) {
          formData.append("image", validatedData[key]);
          console.log("📸 Image appended:", validatedData[key].name);
        } else if (key === "skills" && validatedData[key]) {
          const skillsArray = validatedData[key].split(",").map((skill) => skill.trim());
          formData.append(key, JSON.stringify(skillsArray));
          console.log("🛠️ Skills appended as JSON:", JSON.stringify(skillsArray));
        } else if (validatedData[key] !== undefined && validatedData[key] !== null) {
          if (["registration_date", "joining_date", "dob"].includes(key)) {
            formData.append(key, validatedData[key].toISOString().split("T")[0]);
          } else {
            formData.append(key, validatedData[key]);
          }
          console.log(`➡️ Field ${key} appended:`, formData.get(key));
        }
      }

      console.log("🚀 Sending POST request to:", REGISTER_URL);
      const response = await axios.post(REGISTER_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Server response:", response.status, response.data);

      set((state) => ({
        users: [...state.users, response.data.user],
        loading: false,
      }));
      return response.data.user;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Zod validation error:", error.errors);
        set({
          error: error.errors.map((e) => e.message).join(", "),
          loading: false,
        });
      } else {
        const errorMessage = error.response?.data?.message || "Error registering user";
        const errorDetails = error.response?.data?.error || error.message;
        console.error("❌ API error:", error.response?.status, { message: errorMessage, error: errorDetails });
        set({
          error: `${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`,
          loading: false,
        });
      }
      return null;
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      console.log("🚀 Fetching users from:", API_URL);
      const response = await axios.get(API_URL);
      console.log("✅ Fetched users:", response.data);
      set({ users: response.data, loading: false });
    } catch (error) {
      console.error("❌ Fetch error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        loading: false,
      });
    }
  },

  updateUser: async (userId, updatedData) => {
    set({ loading: true, error: null });
    try {
      console.log("🚀 Updating user ID:", userId, "with:", updatedData);
      const formData = new FormData();
      for (const key in updatedData) {
        if (key === "image" && updatedData[key] instanceof File) {
          formData.append("image", updatedData[key]);
          console.log("📸 Image appended:", updatedData[key].name);
        } else if (key === "skills" && updatedData[key]) {
          // Fixed: Convert skills string to array and stringify it
          const skillsArray = Array.isArray(updatedData[key])
            ? updatedData[key]
            : updatedData[key].split(",").map((skill) => skill.trim());
          formData.append(key, JSON.stringify(skillsArray));
          console.log("🛠️ Skills appended as JSON:", JSON.stringify(skillsArray));
        } else if (updatedData[key] !== undefined && updatedData[key] !== null) {
          if (["registration_date", "joining_date", "dob"].includes(key)) {
            let dateValue = updatedData[key];
            if (dateValue instanceof Date) {
              formData.append(key, dateValue.toISOString().split("T")[0]);
            } else if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
              formData.append(key, dateValue);
            } else {
              console.warn(`⚠️ Invalid date format for ${key}:`, dateValue);
              continue;
            }
          } else {
            formData.append(key, updatedData[key]);
          }
          console.log(`➡️ Field ${key} appended:`, formData.get(key));
        }
      }

      const response = await axios.put(`${API_URL}/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Update response:", response.data);

      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...response.data.user } : user
        ),
        loading: false,
      }));
      return response.data.user;
    } catch (error) {
      console.error("❌ Update error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error updating user",
        loading: false,
      });
      return null;
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      console.log("🚀 Deleting user ID:", userId);
      await axios.delete(`${API_URL}/${userId}`);
      console.log("✅ Delete successful");
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        loading: false,
      }));
      return true;
    } catch (error) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error deleting user",
        loading: false,
      });
      return false;
    }
  },
}));