import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileStore } from "../Store/useFileStore";
import { useUserStore } from "../Store/userStore";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaCalendar, FaClock, FaMoneyBillWave, FaTrash, FaEye } from "react-icons/fa";

export let exportedId = null;

const UserList = () => {
  const { fileData, fetchFiles, fetchFileData, deleteFile } = useFileStore();
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const tableContainerRef = useRef(null);
  const rowRefs = useRef([]);

  const { users, fetchUsers, loading: usersLoading, error: usersError } = useUserStore();
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isShowPayrollOpen, setIsShowPayrollOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [generatedPayrolls, setGeneratedPayrolls] = useState({});
  const [payrollSettings, setPayrollSettings] = useState({
    selectedMonth: null, // Now a Date object
    saturdayOffEmployees: [],
    officialLeaves: "",
    allowedHoursPerDay: {},
  });

  useEffect(() => {
    fetchFiles();
    fetchUsers();
  }, [fetchFiles, fetchUsers]);

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
    setTableData(parsedData);
    setError("");
    setExpandedSections({});
  };

  const parseCSV = (csvText) => {
    const rows = csvText.split("\n").filter((row) => row.trim() !== "");
    const data = rows.map((row) => row.split(","));
    if (data.length <= 7) return [];
    return data.slice(7);
  };

  const toggleExpand = (startIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [startIndex]: !prev[startIndex],
    }));
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr || timeStr === "" || timeStr === "0:00") return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const calculateLateEarlyAndAbsent = (sectionData, employeeId) => {
    const standardInTime = timeToMinutes("9:00");
    const lateThreshold = timeToMinutes("9:30");
    const standardOutTime = timeToMinutes("18:00");
    const earlyThreshold = timeToMinutes("17:30");

    let lateCount = 0;
    let earlyCount = 0;
    let absentCount = 0;
    const lateDates = [];
    const earlyDates = [];
    const absentDates = [];

    sectionData.forEach((row) => {
      const date = row[0]?.trim();
      const dayOfWeek = row[1]?.trim(); // Assuming day of week is in column 1 (e.g., "Sat.")
      const inTime = row[4]?.trim();
      const outTime = row[6]?.trim();

      if (date && date.match(/^\d{2}\/\d{2}\/\d{4}$/) && dayOfWeek) {
        const isSunday = dayOfWeek === "Sun.";
        const isSaturday = dayOfWeek === "Sat.";

        // Skip Sundays (off for all) and Saturdays (off for "Saturday Off" employees)
        if (isSunday || (isSaturday && payrollSettings.saturdayOffEmployees.includes(employeeId))) {
          return; // Do not count as absent or process further
        }

        // Process weekdays and Saturdays (for non-"Saturday Off" employees) for absences, lates, and earlies
        if (
          (!inTime || inTime === "0:00" || inTime === "") &&
          (!outTime || outTime === "0:00" || outTime === "")
        ) {
          absentCount++;
          absentDates.push(date);
        } else if (inTime && outTime && inTime !== "" && outTime !== "") {
          const inMinutes = timeToMinutes(inTime);
          const outMinutes = timeToMinutes(outTime);

          if (inMinutes > lateThreshold) {
            lateCount++;
            lateDates.push(date);
          }

          if (outMinutes < earlyThreshold) {
            earlyCount++;
            earlyDates.push(date);
          }
        }
      }
    });

    return { lateCount, earlyCount, absentCount, lateDates, earlyDates, absentDates };
  };

  const calculateWorkingDays = (month, saturdayOff = false) => {
    if (!month) return 0;
    const year = month.getFullYear();
    const monthNum = month.getMonth(); // 0-based
    const date = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= lastDay; day++) {
      date.setDate(day);
      const isSunday = date.getDay() === 0;
      const isSaturday = date.getDay() === 6;

      // Sundays are off for everyone, Saturdays are off only for "Saturday Off" employees
      if (isSunday || (saturdayOff && isSaturday)) continue;
      workingDays++;
    }
    return workingDays;
  };

  const convertToDecimalHours = (timeStr) => {
    if (!timeStr || timeStr === "0:00") return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const handleGenerateAllPayrolls = () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    if (!payrollSettings.selectedMonth) {
      setError("Please select a month in the payroll settings.");
      return;
    }

    const month = `${payrollSettings.selectedMonth.getFullYear()}-${(payrollSettings.selectedMonth.getMonth() + 1).toString().padStart(2, "0")}`;
    const payrolls = {};
    const issues = [];

    users.forEach((user) => {
      const userIndex = tableData.findIndex(
        (row) =>
          row.length > 1 &&
          row[0].trim() === "User ID" &&
          row[1].trim() === user.employee_id
      );

      let totalWorkingHours = "0:00";
      let lateCount = 0;
      let earlyCount = 0;
      let absentCount = 0;
      let lateDates = [];
      let earlyDates = [];
      let absentDates = [];
      let sectionData = [];

      if (userIndex !== -1) {
        const nextUserIdIndex = tableData
          .slice(userIndex + 1)
          .findIndex((row) => row.length > 1 && row[0].trim() === "User ID");
        const endIndex =
          nextUserIdIndex === -1 ? tableData.length : userIndex + nextUserIdIndex + 1;
        sectionData = tableData.slice(userIndex, endIndex);

        const totalRow = sectionData.find((row) => row[0].trim() === "Total");
        if (totalRow && totalRow[14]) {
          totalWorkingHours = totalRow[14].trim();
        }

        const { lateCount: lc, earlyCount: ec, absentCount: ac, lateDates: ld, earlyDates: ed, absentDates: ad } =
          calculateLateEarlyAndAbsent(sectionData, user.employee_id);
        lateCount = lc;
        earlyCount = ec;
        absentCount = ac;
        lateDates = ld;
        earlyDates = ed;
        absentDates = ad;
      }

      if (!user.Salary_Cap || user.Salary_Cap === "N/A" || !user.in_time || !user.out_time) {
        issues.push(
          `Payroll not generated for ${user.full_name} (${user.employee_id}): ` +
            (!user.Salary_Cap || user.Salary_Cap === "N/A" ? "Salary Cap missing or invalid" : "") +
            (!user.in_time ? ", In Time missing" : "") +
            (!user.out_time ? ", Out Time missing" : "")
        );
        return;
      }

      const isSaturdayOff = payrollSettings.saturdayOffEmployees.includes(user.employee_id);
      const workingDays = calculateWorkingDays(payrollSettings.selectedMonth, isSaturdayOff);
      const officialLeaves = parseInt(payrollSettings.officialLeaves || 0);
      const allowedHoursPerDay = parseFloat(payrollSettings.allowedHoursPerDay[user.employee_id] || 8);
      const allowedTotalHours = allowedHoursPerDay * workingDays;

      let totalHoursDecimal = convertToDecimalHours(totalWorkingHours);
      const notAllowedHours = totalHoursDecimal > allowedTotalHours ? totalHoursDecimal - allowedTotalHours : 0;
      totalHoursDecimal = Math.min(totalHoursDecimal, allowedTotalHours);

      const salaryCap = parseFloat(user.Salary_Cap);
      const hourlyWage = salaryCap / (workingDays * allowedHoursPerDay) / 2; // 50% of salary cap for hourly wage
      const dailyAllowanceRate = salaryCap / workingDays / 2; // 50% of salary cap for daily allowance

      const allowedAbsences = 2;
      const allowedLates = 3;
      const effectiveAbsentCount = Math.max(0, absentCount - officialLeaves);

      let adjustedWorkingDays = workingDays - Math.max(0, effectiveAbsentCount - allowedAbsences) + officialLeaves;
      let effectiveAllowanceDays = adjustedWorkingDays - Math.max(0, lateCount - allowedLates);
      effectiveAllowanceDays = Math.max(0, effectiveAllowanceDays);

      const hourlySalary = totalHoursDecimal * hourlyWage;
      const dailyAllowanceTotal = effectiveAllowanceDays * dailyAllowanceRate;
      const grossSalary = Math.min(hourlySalary + dailyAllowanceTotal, salaryCap);

      const payrollOutput = {
        employee_id: user.employee_id,
        full_name: user.full_name,
        month,
        total_working_hours: totalHoursDecimal.toFixed(2),
        not_allowed_hours: notAllowedHours.toFixed(2),
        official_working_days: workingDays,
        adjusted_working_days: adjustedWorkingDays,
        effective_allowance_days: effectiveAllowanceDays,
        hourly_wage: hourlyWage.toFixed(2),
        daily_allowance_rate: dailyAllowanceRate.toFixed(2),
        daily_allowance_total: dailyAllowanceTotal.toFixed(2),
        official_leaves: officialLeaves,
        allowed_hours_per_day: allowedHoursPerDay,
        hourly_salary: hourlySalary.toFixed(2),
        gross_salary: grossSalary.toFixed(2),
        late_count: lateCount,
        early_count: earlyCount,
        absent_count: absentCount,
        effective_absent_count: effectiveAbsentCount,
        late_dates: lateDates,
        early_dates: earlyDates,
        absent_dates: absentDates,
        table_section_data: sectionData,
        Salary_Cap: user.Salary_Cap,
      };

      payrolls[user.employee_id] = payrollOutput;

      console.log(`Payroll for ${user.full_name} (${user.employee_id}):`, payrollOutput);
    });

    if (issues.length > 0) {
      console.log("Payroll Generation Issues:");
      issues.forEach((issue) => console.log(issue));
    }

    setGeneratedPayrolls(payrolls);
    setIsPayrollModalOpen(false);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const receiptVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const employeeIds = users.map((user) => user.employee_id);

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6 min-h-screen">
      <div className="md:w-1/2 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Uploaded Files</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="w-full mb-4">
          <ul className="border p-2 rounded-md shadow-md bg-white max-h-[300px] overflow-y-auto">
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
                  <button
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                    onClick={() => deleteFile(file.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div
              ref={tableContainerRef}
              className="overflow-auto border rounded-md shadow-lg bg-white max-h-[400px]"
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
                      const isUserIdRow = row[0].trim() === "User ID";
                      let userId = null;

                      if (isUserIdRow && row.length > 1) {
                        userId = row[1].trim();
                      }

                      if (isUserIdRow && userId && employeeIds.includes(userId)) {
                        return (
                          <motion.tr
                            key={rowIndex}
                            ref={(el) => (rowRefs.current[rowIndex] = el)}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            className="border-b bg-yellow-200 font-bold cursor-pointer hover:bg-yellow-300"
                            onClick={() => toggleExpand(rowIndex)}
                          >
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border text-sm p-1">
                                {cell}
                              </td>
                            ))}
                          </motion.tr>
                        );
                      }

                      const sectionData = Object.keys(expandedSections)
                        .map((startIndex) => {
                          const start = parseInt(startIndex);
                          const startRow = tableData[start];
                          const isStartUserIdRow = startRow[0].trim() === "User ID";

                          if (!isStartUserIdRow || startRow.length <= 1) return null;

                          const startUserId = startRow[1].trim();
                          if (!employeeIds.includes(startUserId)) return null;

                          const nextUserIdIndex = tableData
                            .slice(start + 1)
                            .findIndex((r) => r.length > 1 && r[0].trim() === "User ID");
                          const end =
                            nextUserIdIndex === -1
                              ? tableData.length
                              : start + nextUserIdIndex;

                          if (rowIndex <= start || rowIndex >= end) return null;

                          if (rowIndex === start + 1) return null;

                          return (
                            <motion.tr
                              key={rowIndex}
                              variants={rowVariants}
                              initial="hidden"
                              animate="visible"
                              className="border-b hover:bg-gray-100"
                            >
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border text-sm p-1">
                                  {cell}
                                </td>
                              ))}
                            </motion.tr>
                          );
                        })
                        .filter(Boolean);

                      return sectionData.length > 0 ? sectionData[0] : null;
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="md:w-1/2 w-full min-w-0">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Reg. Users</h2>
        {usersError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4 text-sm">
            {usersError}
          </div>
        )}

        {usersLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-[oklch(0.67_0.19_42.13)]">
                <tr>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-800 uppercase tracking-tighter">
                    Emp. ID
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-800 uppercase tracking-tighter">
                    Name
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-800 uppercase tracking-tighter">
                    Pos.
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-800 uppercase tracking-tighter">
                    Action
                  </th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-800 uppercase tracking-tighter">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                      {user.employee_id}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
                      {user.post_applied_for}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs flex gap-2">
                      {generatedPayrolls[user.employee_id] && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsShowPayrollOpen(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                          >
                            <FaEye /> Show
                          </button>
                          <button
                            onClick={() => {
                              setGeneratedPayrolls((prev) => {
                                const updated = { ...prev };
                                delete updated[user.employee_id];
                                return updated;
                              });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      )}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs">
                      {generatedPayrolls[user.employee_id] ? (
                        <span className="text-green-600 font-semibold">Generated</span>
                      ) : (
                        <span className="text-gray-600">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex gap-4">
          <Link
            to="/register"
            className="inline-block px-4 py-1 bg-[oklch(0.67_0.19_42.13)] text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer text-sm"
          >
            Back
          </Link>
          <button
            onClick={() => setIsPayrollModalOpen(true)}
            className="inline-block px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-sm"
          >
            Payroll Generation
          </button>
        </div>
      </div>

      {/* Payroll Generation Modal */}
      <AnimatePresence>
        {isPayrollModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
                <h3 className="text-xl font-semibold text-gray-800">Generate Payrolls</h3>
                <button
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                  <DatePicker
                    selected={payrollSettings.selectedMonth}
                    onChange={(date) => setPayrollSettings((prev) => ({ ...prev, selectedMonth: date }))}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholderText="Pick a month"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <p className="text-sm text-gray-600">
                    {payrollSettings.selectedMonth
                      ? `Regular: ${calculateWorkingDays(payrollSettings.selectedMonth, false)}, Saturday Off: ${calculateWorkingDays(payrollSettings.selectedMonth, true)}`
                      : "Select a month to see working days"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saturday Off Employees</label>
                  <select
                    multiple
                    value={payrollSettings.saturdayOffEmployees}
                    onChange={(e) =>
                      setPayrollSettings((prev) => ({
                        ...prev,
                        saturdayOffEmployees: Array.from(e.target.selectedOptions, (option) => option.value),
                      }))
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                  >
                    {users.map((user) => (
                      <option key={user.employee_id} value={user.employee_id}>
                        {user.full_name} ({user.employee_id})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Leaves (Excluding Sundays)</label>
                  <input
                    type="number"
                    value={payrollSettings.officialLeaves}
                    onChange={(e) =>
                      setPayrollSettings((prev) => ({ ...prev, officialLeaves: e.target.value }))
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number of official leaves"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Working Hours Per Day</label>
                  {users.map((user) => (
                    <div key={user.employee_id} className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{user.full_name} ({user.employee_id}):</span>
                      <input
                        type="number"
                        value={payrollSettings.allowedHoursPerDay[user.employee_id] || ""}
                        onChange={(e) =>
                          setPayrollSettings((prev) => ({
                            ...prev,
                            allowedHoursPerDay: {
                              ...prev.allowedHoursPerDay,
                              [user.employee_id]: e.target.value,
                            },
                          }))
                        }
                        className="w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 8"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAllPayrolls}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Generate All Payrolls
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Show Payroll Receipt */}
      <AnimatePresence>
        {isShowPayrollOpen && selectedUser && generatedPayrolls[selectedUser.employee_id] && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <motion.div
              variants={receiptVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 border-t-4 border-blue-500 max-h-[80vh] overflow-y-auto"
            >
              <div className="text-center mb-3 sticky top-0 bg-white z-10 pb-2">
                <h3 className="text-lg font-bold text-gray-800">Techmire Solution</h3>
                <h4 className="text-sm font-semibold text-gray-700">Payroll Receipt</h4>
                <p className="text-xs text-gray-500">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="border-t border-b border-dashed py-3 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-orange-500" />
                    <span className="font-semibold">Employee ID:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].employee_id}</span>

                  <div className="flex items-center gap-1">
                    <FaUser className="text-orange-500" />
                    <span className="font-semibold">Name:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].full_name}</span>

                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-orange-500" />
                    <span className="font-semibold">Month:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].month}</span>

                  <div className="flex items-center gap-1">
                    <FaClock className="text-orange-500" />
                    <span className="font-semibold">Total Working Hours:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].total_working_hours}</span>

                  <div className="flex items-center gap-1">
                    <FaClock className="text-orange-500" />
                    <span className="font-semibold">Not Allowed Hours:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].not_allowed_hours}</span>

                  <div className="flex items-center gap-1">
                    <FaClock className="text-orange-500" />
                    <span className="font-semibold">No. of Lates:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].late_count}</span>

                  <div className="flex items-center gap-1">
                    <FaClock className="text-orange-500" />
                    <span className="font-semibold">No. of Absents:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].absent_count}</span>

                  <div className="flex items-center gap-1">
                    <FaMoneyBillWave className="text-orange-500" />
                    <span className="font-semibold">Salary Cap:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].Salary_Cap}</span>

                  <div className="flex items-center gap-1">
                    <FaMoneyBillWave className="text-orange-500" />
                    <span className="font-semibold">Gross Salary:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].gross_salary}</span>

                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-orange-500" />
                    <span className="font-semibold">Official Leaves:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].official_leaves}</span>

                  <div className="flex items-center gap-1">
                    <FaMoneyBillWave className="text-orange-500" />
                    <span className="font-semibold">Daily Allowance:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].daily_allowance_rate}/day</span>

                  <div className="flex items-center gap-1">
                    <FaMoneyBillWave className="text-orange-500" />
                    <span className="font-semibold">Hourly Wage:</span>
                  </div>
                  <span>{generatedPayrolls[selectedUser.employee_id].hourly_wage}/hr</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-1 font-semibold mb-1">
                    <FaCalendar className="text-orange-500" />
                    Late Dates:
                  </div>
                  {generatedPayrolls[selectedUser.employee_id].late_dates.length > 0 ? (
                    <div className="border rounded p-2 bg-gray-50">
                      <table className="w-full text-[9px]">
                        <thead>
                          <tr className="bg-orange-500">
                            <th className="p-1 text-left">#</th>
                            <th className="p-1 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedPayrolls[selectedUser.employee_id].late_dates.map((date, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1">{index + 1}</td>
                              <td className="p-1">{date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-600">No late dates recorded</p>
                  )}
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-1 font-semibold mb-1">
                    <FaCalendar className="text-orange-500" />
                    Absent Dates:
                  </div>
                  {generatedPayrolls[selectedUser.employee_id].absent_dates.length > 0 ? (
                    <div className="border rounded p-2 bg-gray-50">
                      <table className="w-full text-[9px]">
                        <thead>
                          <tr className="bg-orange-500">
                            <th className="p-1 text-left">#</th>
                            <th className="p-1 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedPayrolls[selectedUser.employee_id].absent_dates.map((date, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1">{index + 1}</td>
                              <td className="p-1">{date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-600">No absent dates recorded</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsShowPayrollOpen(false)}
                  className="px-4 py-1 bg-orange-500 text-white rounded-lg hover:bg-gray-600 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;