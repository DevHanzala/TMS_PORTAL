import React, { useState, useEffect } from "react";
import { useFileStore } from "../Store/useFileStore";
import { FaUpload, FaTrash, FaDownload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Popup Component
const Popup = ({ message, type = "success" }) => {
  const bgColor = type === "success" ? "bg-green-100 border-green-500" : 
                  type === "error" ? "bg-red-100 border-red-500" : 
                  "bg-blue-100 border-blue-500";
  const textColor = type === "success" ? "text-green-700" : 
                    type === "error" ? "text-red-700" : 
                    "text-blue-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 ${bgColor} border-l-4 ${textColor} p-4 rounded-lg shadow-lg z-50`}
    >
      {type === "loading" && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
          {message}
        </div>
      )}
      {type !== "loading" && message}
    </motion.div>
  );
};

const UploadPage = () => {
  const { uploadFile, fetchFiles, deleteFile, fileData } = useFileStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [popup, setPopup] = useState(null); // State for popup notifications

  useEffect(() => {
    fetchFiles(); // Fetch files on mount
  }, [fetchFiles]);

  // Helper function to show popup
  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 2000); // Auto-close after 2 seconds
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx")) {
      setErrorMessage("Invalid file format! Please upload an .xlsx file.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrorMessage("");
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      showPopup("Please select a valid .xlsx file first.", "error");
      return;
    }

    showPopup(`Uploading ${selectedFile.name}...`, "loading");
    try {
      await uploadFile(selectedFile);
      showPopup("File uploaded successfully!", "success");
      setSelectedFile(null);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error uploading file:", error);
      showPopup("Failed to upload file.", "error");
    }
  };

  // Handle file deletion
  const handleDelete = async (fileId, filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      showPopup(`Deleting ${filename}...`, "loading");
      try {
        await deleteFile(fileId);
        showPopup(`${filename} deleted successfully!`, "success");
        fetchFiles(); // Refresh the file list
      } catch (error) {
        console.error("Error deleting file:", error);
        showPopup("Failed to delete file.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden"
      >
        {/* Left side - File Upload UI */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload Excel File</h2>

          <motion.label
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            htmlFor="file-upload"
            className="block bg-gray-500 text-white p-3 rounded cursor-pointer hover:bg-gray-700 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <FaUpload /> Choose File
            </div>
          </motion.label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".xlsx"
            className="hidden"
          />

          {selectedFile && (
            <p className="mt-3 text-sm text-gray-600">File: {selectedFile.name} ✅</p>
          )}
          {errorMessage && (
            <p className="mt-2 text-red-600 text-sm">{errorMessage}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            disabled={!selectedFile}
          >
            Upload
          </motion.button>
        </div>

        {/* Right side - File List */}
        <div className="w-full md:w-1/2 bg-gray-500 text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
          <ul>
            {fileData.length > 0 ? (
              fileData.map((file) => (
                <motion.li
                  key={file.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center mb-2 bg-gray-600 p-2 rounded"
                >
                  <span className="truncate">{file.filename}</span>
                  <div className="flex gap-2">
                    <a
                      href={`http://localhost:5000/api/files/${file.id}`}
                      download={file.filename}
                      className="text-green-300 hover:text-green-500"
                    >
                      <FaDownload />
                    </a>
                    <button
                      onClick={() => handleDelete(file.id, file.filename)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.li>
              ))
            ) : (
              <p className="text-gray-300">No files uploaded yet.</p>
            )}
          </ul>
        </div>
      </motion.div>

      {/* Popup Notification */}
      <AnimatePresence>
        {popup && <Popup message={popup.message} type={popup.type} />}
      </AnimatePresence>
    </div>
  );
};

export default UploadPage;