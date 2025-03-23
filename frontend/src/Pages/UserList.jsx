import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileStore } from "../Store/useFileStore";
import { useUserStore } from "../Store/userStore";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaCalendar, FaClock, FaMoneyBillWave, FaTrash, FaEye, FaLeaf, FaHourglass } from "react-icons/fa";
import logo from "../assets/TMS-LOGO.webp"; // Adjust path based on your project structure

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
    selectedMonth: null,
    saturdayOffEmployees: [],
    officialLeaves: "",
    allowedHoursPerDay: 8,
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
      const dayOfWeek = row[1]?.trim();
      const inTime = row[4]?.trim();
      const outTime = row[6]?.trim();

      if (date && date.match(/^\d{2}\/\d{2}\/\d{4}$/) && dayOfWeek) {
        const isSunday = dayOfWeek === "Sun.";
        const isSaturday = dayOfWeek === "Sat.";

        if (isSunday || (isSaturday && payrollSettings.saturdayOffEmployees.includes(employeeId))) {
          return;
        }

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
    const monthNum = month.getMonth();
    const date = new Date(year, monthNum, 1);
    const lastDay = new Date(year, monthNum + 1, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= lastDay; day++) {
      date.setDate(day);
      const isSunday = date.getDay() === 0;
      const isSaturday = date.getDay() === 6;

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
      const allowedHoursPerDay = parseFloat(payrollSettings.allowedHoursPerDay);
      const allowedTotalHours = allowedHoursPerDay * workingDays;

      let totalHoursDecimal = convertToDecimalHours(totalWorkingHours);
      const notAllowedHours = totalHoursDecimal > allowedTotalHours ? totalHoursDecimal - allowedTotalHours : 0;
      totalHoursDecimal = Math.min(totalHoursDecimal, allowedTotalHours);

      const salaryCap = parseFloat(user.Salary_Cap);
      const hourlyWage = salaryCap / (workingDays * allowedHoursPerDay) / 2;
      const dailyAllowanceRate = salaryCap / workingDays / 2;

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

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
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
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => deleteFile(file.id)}
                  >
                    Delete
                  </motion.button>
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
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsShowPayrollOpen(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
                          >
                            <FaEye /> Show
                          </motion.button>
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => {
                              setGeneratedPayrolls((prev) => {
                                const updated = { ...prev };
                                delete updated[user.employee_id];
                                return updated;
                              });
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </motion.button>
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
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsPayrollModalOpen(true)}
            className="inline-block px-4 py-1 bg-green-500 text-white rounded-lg text-sm"
          >
            Payroll Generation
          </motion.button>
        </div>
      </div>

      {/* Payroll Generation Modal */}
      <AnimatePresence>
        {isPayrollModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto border-t-4 border-green-500"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 rounded-t-xl p-2"
              >
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" /> Generate Payrolls
                </h3>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </motion.button>
              </motion.div>
              <div className="space-y-6">
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaCalendar className="text-blue-500" /> Select Month
                  </label>
                  <DatePicker
                    selected={payrollSettings.selectedMonth}
                    onChange={(date) => setPayrollSettings((prev) => ({ ...prev, selectedMonth: date }))}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholderText="Pick a month"
                  />
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaClock className="text-purple-500" /> Working Days
                  </label>
                  <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    {payrollSettings.selectedMonth
                      ? `Regular: ${calculateWorkingDays(payrollSettings.selectedMonth, false)}, Saturday Off: ${calculateWorkingDays(payrollSettings.selectedMonth, true)}`
                      : "Select a month to see working days"}
                  </p>
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaUser className="text-orange-500" /> Saturday Off Employees
                  </label>
                  <select
                    multiple
                    value={payrollSettings.saturdayOffEmployees}
                    onChange={(e) =>
                      setPayrollSettings((prev) => ({
                        ...prev,
                        saturdayOffEmployees: Array.from(e.target.selectedOptions, (option) => option.value),
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 h-32 shadow-sm"
                  >
                    {users.map((user) => (
                      <option key={user.employee_id} value={user.employee_id}>
                        {user.full_name} ({user.employee_id})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaLeaf className="text-green-500" /> Official Leaves (Excluding Sundays)
                  </label>
                  <input
                    type="number"
                    value={payrollSettings.officialLeaves}
                    onChange={(e) =>
                      setPayrollSettings((prev) => ({ ...prev, officialLeaves: e.target.value }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm"
                    placeholder="Enter number of official leaves"
                  />
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaHourglass className="text-indigo-500" /> Allowed Working Hours Per Day
                  </label>
                  <input
                    type="number"
                    value={payrollSettings.allowedHoursPerDay}
                    onChange={(e) =>
                      setPayrollSettings((prev) => ({
                        ...prev,
                        allowedHoursPerDay: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    placeholder="Default: 8"
                    min="1"
                    max="24"
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex justify-end space-x-4"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md"
                >
                  Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleGenerateAllPayrolls}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md flex items-center gap-2"
                >
                  <FaMoneyBillWave /> Generate All Payrolls
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Show Payroll Receipt */}
      <AnimatePresence>
        {isShowPayrollOpen && selectedUser && generatedPayrolls[selectedUser.employee_id] && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-8 max-h-[90vh] overflow-y-auto border-t-4 border-blue-600"
            >
              {/* Header with Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center mb-6 border-b pb-4"
              >
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Techmire Solution Logo" className="h-16 w-auto" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Techmire Solution</h3>
                    <h4 className="text-md font-semibold text-gray-600">Payroll Receipt</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </motion.div>

              {/* Employee Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h5 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Employee Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Employee ID:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].employee_id}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Name:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].full_name}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Month:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].month}
                  </div>
                </div>
              </motion.div>

              {/* Payroll Summary Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h5 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" /> Payroll Summary
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Total Working Hours:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].total_working_hours} hrs
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Not Allowed Hours:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].not_allowed_hours} hrs
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">No. of Lates:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].late_count}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">No. of Absents:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].absent_count}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Salary Cap:</span> $
                    {generatedPayrolls[selectedUser.employee_id].Salary_Cap}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Gross Salary:</span> $
                    {generatedPayrolls[selectedUser.employee_id].gross_salary}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Official Leaves:</span>{" "}
                    {generatedPayrolls[selectedUser.employee_id].official_leaves}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Daily Allowance:</span> $
                    {generatedPayrolls[selectedUser.employee_id].daily_allowance_rate}/day
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Hourly Wage:</span> $
                    {generatedPayrolls[selectedUser.employee_id].hourly_wage}/hr
                  </div>
                </div>
              </motion.div>

              {/* Late and Absent Dates Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h5 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FaCalendar className="text-orange-500" /> Attendance Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="font-semibold text-gray-600 mb-2">Late Dates:</h6>
                    {generatedPayrolls[selectedUser.employee_id].late_dates.length > 0 ? (
                      <div className="border rounded-lg p-3 bg-white shadow-sm">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-orange-100">
                              <th className="p-2 text-left font-semibold">#</th>
                              <th className="p-2 text-left font-semibold">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatedPayrolls[selectedUser.employee_id].late_dates.map((date, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-500">No late dates recorded</p>
                    )}
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-600 mb-2">Absent Dates:</h6>
                    {generatedPayrolls[selectedUser.employee_id].absent_dates.length > 0 ? (
                      <div className="border rounded-lg p-3 bg-white shadow-sm">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-orange-100">
                              <th className="p-2 text-left font-semibold">#</th>
                              <th className="p-2 text-left font-semibold">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatedPayrolls[selectedUser.employee_id].absent_dates.map((date, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-500">No absent dates recorded</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Footer with Close Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end mt-6"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setIsShowPayrollOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md flex items-center gap-2"
                >
                  <FaEye /> Close
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;