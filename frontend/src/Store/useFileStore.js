import { create } from "zustand";
import axios from "axios";

export const useFileStore = create((set) => ({
  fileData: [],

  // Upload File
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        fileData: [...state.fileData, response.data.file], // Add new file
      }));
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert("File upload failed. Please try again.");
    }
  },

  // Fetch Files
  fetchFiles: async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/files");
      set({ fileData: response.data.files });
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    }
  },

  // Fetch File Content by ID
  fetchFileData: async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/files/${id}`);
      return response.data.content; // Return the CSV content
    } catch (error) {
      console.error("Fetch File Error:", error.response?.data || error.message);
      return null;
    }
  },

  // Delete File
  deleteFile: async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`);
      set((state) => ({
        fileData: state.fileData.filter((file) => file.id !== id),
      }));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
    }
  },
}));
