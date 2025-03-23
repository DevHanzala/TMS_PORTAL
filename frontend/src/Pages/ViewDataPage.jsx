import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useFileStore } from "../Store/useFileStore";
import { useAuthStore } from "../Store/authStore";
import UserList from "./UserList";

export let exportedId = null;

const ViewDataPage = () => {
  const { fileData, fetchFiles, fetchFileData, deleteFile } = useFileStore();
  const { role, user } = useAuthStore(); // Get role and user from authStore
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const tableContainerRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileClick = async (file) => {
    setSelectedFile(file.filename);
    setLoading(true);
    setSelectedFileId(file.id);
    const content = await fetchFileData(file.id);
    setLoading(false);

    if (!content) {
      setError("Failed to load file content.");
      return;
    }
    const parsedData = parseCSV(content);
    
    // Filter data based on role
    if (role === "employee" && user?.employee_id) {
      const filteredData = filterEmployeeData(parsedData, user.employee_id);
      setTableData(filteredData);
    } else {
      setTableData(parsedData);
    }
    
    setError("");
    setExpandedSections({});
  };

  const parseCSV = (csvText) => {
    const rows = csvText.split("\n").filter((row) => row.trim() !== "");
    const data = rows.map((row) => row.split(","));
    if (data.length <= 7) return [];
    return data.slice(7);
  };

  // Function to filter data for specific employee
  const filterEmployeeData = (data, employeeId) => {
    const userIndex = data.findIndex(
      (row) => row[0].trim() === "User ID" && row[1].trim() === employeeId
    );
    
    if (userIndex === -1) return [];
    
    const nextUserIdIndex = data
      .slice(userIndex + 1)
      .findIndex((row) => row[0].trim() === "User ID");
    const endIndex = nextUserIdIndex === -1 ? data.length : userIndex + nextUserIdIndex + 1;
    
    return data.slice(userIndex, endIndex);
  };

  const toggleExpand = (startIndex) => {
    setExpandedSections((prev) => {
      const newSections = { ...prev };
      if (newSections[startIndex]) {
        delete newSections[startIndex];
      } else {
        newSections[startIndex] = true;
      }
      return newSections;
    });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const foundIndex = tableData.findIndex((row) =>
      row.some((cell) => cell.trim().toLowerCase() === searchQuery.trim().toLowerCase())
    );

    if (foundIndex !== -1) {
      rowRefs.current[foundIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedRow(foundIndex);
      setTimeout(() => setHighlightedRow(null), 3000);
    }
  };

  return (
    <div className="p-4 min-h-[58vh]">
      {error && <p className="text-red-500">{error}</p>}

      {/* File List */}
      <div className="w-full mb-4">
        <ul className="border p-2 rounded-md shadow-md bg-white">
          {fileData.length === 0 ? (
            <p className="text-gray-600">No files found</p>
          ) : (
            fileData.map((file) => (
              <li
                key={file.id}
                className="cursor-pointer p-2 hover:bg-gray-100 border-b flex justify-between items-center"
              >
                <span onClick={() => handleFileClick(file)} className="cursor-pointer">
                  📄 {file.filename}
                </span>
                {/* Show Delete button only if role is 'hr' */}
                {role === "hr" && (
                  <button
                    className="bg-orange-500 text-white px-3 py-1 rounded text-lg hover:bg-orange-600"
                    onClick={() => deleteFile(file.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Search Bar - Only show for non-employee roles */}
      {selectedFile && role !== "employee" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 flex items-center gap-2"
        >
          <input
            type="text"
            className="border p-2 rounded-md shadow-sm w-full"
            placeholder="Search User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </motion.div>
      )}

      {/* Scrollable Table */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div
            ref={tableContainerRef}
            className="overflow-auto border rounded-md shadow-lg bg-white max-h-[600px]"
          >
            {loading ? (
              <div className="animate-pulse p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded mb-2"></div>
                ))}
              </div>
            ) : (
              <table className="w-full border-collapse">
                <tbody>
                  {tableData.map((row, rowIndex) => {
                    const isUserIdRow = row.some((cell) => cell.includes("User ID"));

                    if (isUserIdRow) {
                      return (
                        <motion.tr
                          key={rowIndex}
                          ref={(el) => (rowRefs.current[rowIndex] = el)}
                          className={`border-b bg-yellow-200 font-bold cursor-pointer hover:bg-yellow-300 ${
                            highlightedRow === rowIndex ? "bg-yellow-400" : ""
                          }`}
                          onClick={() => toggleExpand(rowIndex)}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border text-sm p-1">
                              {cell}
                            </td>
                          ))}
                        </motion.tr>
                      );
                    }

                    const shouldShow = Object.keys(expandedSections).some((startIndex) => {
                      const start = parseInt(startIndex);
                      const nextUserIdIndex = tableData.slice(start + 1).findIndex((r) =>
                        r.some((cell) => cell.includes("User ID"))
                      );
                      const end = nextUserIdIndex === -1 ? tableData.length : start + nextUserIdIndex + 1;
                      return rowIndex > start && rowIndex < end;
                    });

                    if (shouldShow) {
                      return (
                        <motion.tr
                          key={rowIndex}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                          className={`border-b hover:bg-gray-100 ${
                            highlightedRow === rowIndex ? "bg-gray-300" : ""
                          }`}
                        >
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border text-sm p-1">
                              {cell}
                            </td>
                          ))}
                        </motion.tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
      <div style={{ display: "none" }}>
        <UserList exportedId={selectedFileId} />
      </div>
    </div>
  );
};

export default ViewDataPage;