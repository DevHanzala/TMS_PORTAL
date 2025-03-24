// Store/userStore.js
import { create } from "zustand";
import axios from "axios";
import z from "zod";
import { registerUserSchema } from "../Scheema/userScheema";

const API_URL = "http://localhost:5000/api/users";
const REGISTER_URL = `${API_URL}/upload`;

// Create Zustand store for user management
export const useUserStore = create((set) => ({
  users: [], // Array to store all users
  loading: false, // Loading state for async operations
  error: null, // Error state for failed operations

  // ✅ Register a new user
  registerUser: async (userData) => {
    set({ loading: true, error: null }); // Set loading state and clear errors
    try {
      const validatedData = registerUserSchema.parse(userData); // Validate data with Zod schema

      // Prepare FormData for multipart/form-data request
      const formData = new FormData();
      for (const key in validatedData) {
        if (key === "image" && validatedData[key] instanceof File) {
          formData.append("image", validatedData[key]); // Append image file
        } else if (key === "skills" && validatedData[key]) {
          const skillsArray = validatedData[key].split(",").map((skill) => skill.trim()); // Convert skills string to array
          formData.append(key, JSON.stringify(skillsArray)); // Append as JSON string
        } else if (validatedData[key] !== undefined && validatedData[key] !== null) {
          if (["registration_date", "joining_date", "dob"].includes(key)) {
            formData.append(key, validatedData[key].toISOString().split("T")[0]); // Format dates as YYYY-MM-DD
          } else {
            formData.append(key, validatedData[key]); // Append other fields as-is
          }
        }
      }

      const response = await axios.post(REGISTER_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update state with new user
      set((state) => ({
        users: [...state.users, response.data.user],
        loading: false,
      }));
      return response.data.user; // Return created user
    } catch (error) {
      // Handle validation or API errors
      if (error instanceof z.ZodError) {
        console.error("❌ Zod validation error:", error.errors); // Log Zod errors
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
      return null; // Return null on failure
    }
  },

  // ✅ Fetch all users
  fetchUsers: async () => {
    set({ loading: true, error: null }); // Set loading state
    try {
      const response = await axios.get(API_URL);

      // Update state with fetched users
      set({ users: response.data, loading: false });
    } catch (error) {
      // Handle fetch errors
      console.error("❌ Fetch error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        loading: false,
      });
    }
  },

  // ✅ Update user by ID
  updateUser: async (userId, updatedData) => {
    set({ loading: true, error: null }); // Set loading state
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        if (key === "image" && updatedData[key] instanceof File) {
          formData.append("image", updatedData[key]); // Append image file
        } else if (key === "skills" && updatedData[key]) {
          const skillsArray = Array.isArray(updatedData[key])
            ? updatedData[key]
            : updatedData[key].split(",").map((skill) => skill.trim()); // Convert skills to array
          formData.append(key, JSON.stringify(skillsArray)); // Append as JSON
        } else if (updatedData[key] !== undefined && updatedData[key] !== null) {
          if (["registration_date", "joining_date", "dob"].includes(key)) {
            let dateValue = updatedData[key];
            if (dateValue instanceof Date) {
              formData.append(key, dateValue.toISOString().split("T")[0]); // Format Date object
            } else if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
              formData.append(key, dateValue); // Use string if already in correct format
            } else {
              console.warn(`⚠️ Invalid date format for ${key}:`, dateValue); // Warn on invalid format
              continue;
            }
          } else {
            formData.append(key, updatedData[key]); // Append other fields
          }
        }
      }

      // Send update request to API
      const response = await axios.put(`${API_URL}/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update state with updated user
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...response.data.user } : user
        ),
        loading: false,
      }));
      return response.data.user; // Return updated user
    } catch (error) {
      // Handle update errors
      console.error("❌ Update error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error updating user",
        loading: false,
      });
      return null; // Return null on failure
    }
  },

  // ✅ Delete user by ID and move to ex-employees
  deleteUser: async (userId) => {
    set({ loading: true, error: null }); // Set loading state
    try {

      // Send delete request (backend will move to ex-employees)
      await axios.delete(`${API_URL}/${userId}`);
      // Update state by removing user from list
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        loading: false,
      }));
      return true; // Return success
    } catch (error) {
      // Handle delete errors
      console.error("❌ Delete error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Error deleting user",
        loading: false,
      });
      return false; // Return failure
    }
  },
}));