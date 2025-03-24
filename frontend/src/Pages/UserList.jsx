import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileStore } from "../Store/useFileStore";
import { useUserStore } from "../Store/userStore";
import { usePayrollStore } from "../Store/payrollStore";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaCalendar, FaClock, FaMoneyBillWave, FaTrash, FaEye, FaLeaf, FaHourglass, FaEdit, FaPlus, FaDownload } from "react-icons/fa";
import logo from "../assets/TMS-LOGO.webp";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { fontSize: 12, color: "#666" },
  generated: { fontSize: 10, color: "#999" },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  table: { borderWidth: 1, borderColor: "#ddd" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ddd" },
  tableCell: { padding: 5, width: "50%", fontSize: 10 },
  tableCellBold: { padding: 5, width: "50%", fontSize: 10, fontWeight: "bold" },
  subTable: { borderWidth: 1, borderColor: "#ddd", marginTop: 5 },
  subTableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#ddd" },
  subTableCell: { padding: 3, width: "20%", fontSize: 8, textAlign: "center" },
  subTableCellDate: { padding: 3, width: "80%", fontSize: 8 },
});

// PDF Document Component
const PayrollSlipPDF = ({ payroll }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image src={logo} style={styles.logo} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.title}>Techmire Solution</Text>
            <Text style={styles.subtitle}>Payroll Slip</Text>
          </View>
        </View>
        <Text style={styles.generated}>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employee Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellBold}>Employee ID</Text>
            <Text style={styles.tableCell}>{payroll.employee_id}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellBold}>Name</Text>
            <Text style={styles.tableCell}>{payroll.full_name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellBold}>Month</Text>
            <Text style={styles.tableCell}>{payroll.month}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payroll Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Total Working Hours</Text><Text style={styles.tableCell}>{payroll.total_working_hours} hrs</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Not Allowed Hours</Text><Text style={styles.tableCell}>{payroll.not_allowed_hours} hrs</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Official Working Days</Text><Text style={styles.tableCell}>{payroll.official_working_days}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Adjusted Working Days</Text><Text style={styles.tableCell}>{payroll.adjusted_working_days}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Effective Allowance Days</Text><Text style={styles.tableCell}>{payroll.effective_allowance_days}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Hourly Wage</Text><Text style={styles.tableCell}>{payroll.hourly_wage} PKR/hr</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Daily Allowance Rate</Text><Text style={styles.tableCell}>{payroll.daily_allowance_rate} PKR/day</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Daily Allowance Total</Text><Text style={styles.tableCell}>{payroll.daily_allowance_total} PKR</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Official Leaves</Text><Text style={styles.tableCell}>{payroll.official_leaves}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Allowed Hours/Day</Text><Text style={styles.tableCell}>{payroll.allowed_hours_per_day} hrs</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Hourly Salary</Text><Text style={styles.tableCell}>{payroll.hourly_salary} PKR</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Gross Salary</Text><Text style={styles.tableCell}>{payroll.gross_salary} PKR</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Late Count</Text><Text style={styles.tableCell}>{payroll.late_count}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Absent Count</Text><Text style={styles.tableCell}>{payroll.absent_count}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Effective Absent Count</Text><Text style={styles.tableCell}>{payroll.effective_absent_count}</Text></View>
          <View style={styles.tableRow}><Text style={styles.tableCellBold}>Salary Cap</Text><Text style={styles.tableCell}>{payroll.Salary_Cap} PKR</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance Details</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>Late Dates</Text>
            {payroll.late_dates.length > 0 ? (
              <View style={styles.subTable}>
                <View style={styles.subTableRow}>
                  <Text style={styles.subTableCell}>#</Text>
                  <Text style={styles.subTableCellDate}>Date</Text>
                </View>
                {payroll.late_dates.map((date, index) => (
                  <View key={index} style={styles.subTableRow}>
                    <Text style={styles.subTableCell}>{index + 1}</Text>
                    <Text style={styles.subTableCellDate}>{date}</Text>
                  </View>
                ))}
              </View>
            ) : <Text style={{ fontSize: 8, fontStyle: "italic" }}>No late dates</Text>}
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>Absent Dates</Text>
            {payroll.absent_dates.length > 0 ? (
              <View style={styles.subTable}>
                <View style={styles.subTableRow}>
                  <Text style={styles.subTableCell}>#</Text>
                  <Text style={styles.subTableCellDate}>Date</Text>
                </View>
                {payroll.absent_dates.map((date, index) => (
                  <View key={index} style={styles.subTableRow}>
                    <Text style={styles.subTableCell}>{index + 1}</Text>
                    <Text style={styles.subTableCellDate}>{date}</Text>
                  </View>
                ))}
              </View>
            ) : <Text style={{ fontSize: 8, fontStyle: "italic" }}>No absent dates</Text>}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const UserList = () => {
  const { fileData, fetchFiles, fetchFileData, deleteFile } = useFileStore();
  const { users, fetchUsers, loading: usersLoading, error: usersError } = useUserStore();
  const { payrollData, fetchPayrolls, createPayrolls, updatePayroll, deletePayroll, deleteAllPayrolls, loading: payrollLoading, error: payrollError } = usePayrollStore();

  const [selectedFileId, setSelectedFileId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isShowPayrollOpen, setIsShowPayrollOpen] = useState(false);
  const [isEditPayrollOpen, setIsEditPayrollOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPayroll, setEditPayroll] = useState(null);
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
    fetchPayrolls();
  }, [fetchFiles, fetchUsers, fetchPayrolls]);

  const showMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFileChange = async (e) => {
    const fileId = e.target.value;
    if (!fileId) {
      setSelectedFileId(null);
      setTableData([]);
      return;
    }
    setSelectedFileId(fileId);
    setLoading(true);
    const file = fileData.find((f) => f.id === fileId);
    const content = await fetchFileData(fileId);
    setLoading(false);

    if (!content) {
      setError("Failed to load file content.");
      return;
    }
    const parsedData = parseCSV(content);
    setTableData(parsedData);
    setError("");
  };

  const parseCSV = (csvText) => {
    const rows = csvText.split("\n").filter((row) => row.trim() !== "");
    const data = rows.map((row) => row.split(","));
    return data.length <= 7 ? [] : data.slice(7);
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

    let lateCount = 0, earlyCount = 0, absentCount = 0;
    const lateDates = [], earlyDates = [], absentDates = [];

    sectionData.forEach((row) => {
      const date = row[0]?.trim();
      const dayOfWeek = row[1]?.trim();
      const inTime = row[4]?.trim();
      const outTime = row[6]?.trim();

      if (date && date.match(/^\d{2}\/\d{2}\/\d{4}$/) && dayOfWeek) {
        const isSunday = dayOfWeek === "Sun.";
        const isSaturday = dayOfWeek === "Sat.";
        if (isSunday || (isSaturday && payrollSettings.saturdayOffEmployees.includes(employeeId))) return;

        if ((!inTime || inTime === "0:00" || inTime === "") && (!outTime || outTime === "0:00" || outTime === "")) {
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

  const handleGenerateAllPayrolls = async () => {
    if (!selectedFileId) {
      setError("Please select a file first.");
      return;
    }
    if (!payrollSettings.selectedMonth) {
      setError("Please select a month in the payroll settings.");
      return;
    }

    const month = `${payrollSettings.selectedMonth.getFullYear()}-${(payrollSettings.selectedMonth.getMonth() + 1).toString().padStart(2, "0")}`;
    const payrolls = [];
    const issues = [];

    users.forEach((user) => {
      const userIndex = tableData.findIndex((row) => row.length > 1 && row[0].trim() === "User ID" && row[1].trim() === user.employee_id);
      let totalWorkingHours = "0:00", lateCount = 0, earlyCount = 0, absentCount = 0, lateDates = [], earlyDates = [], absentDates = [], sectionData = [];

      if (userIndex !== -1) {
        const nextUserIdIndex = tableData.slice(userIndex + 1).findIndex((row) => row.length > 1 && row[0].trim() === "User ID");
        const endIndex = nextUserIdIndex === -1 ? tableData.length : userIndex + nextUserIdIndex + 1;
        sectionData = tableData.slice(userIndex, endIndex);
        const totalRow = sectionData.find((row) => row[0].trim() === "Total");
        if (totalRow && totalRow[14]) totalWorkingHours = totalRow[14].trim();

        const { lateCount: lc, earlyCount: ec, absentCount: ac, lateDates: ld, earlyDates: ed, absentDates: ad } = calculateLateEarlyAndAbsent(sectionData, user.employee_id);
        lateCount = lc; earlyCount = ec; absentCount = ac; lateDates = ld; earlyDates = ed; absentDates = ad;
      }

      if (!user.Salary_Cap || user.Salary_Cap === "N/A" || !user.in_time || !user.out_time) {
        issues.push(`Payroll not generated for ${user.full_name} (${user.employee_id}): ${!user.Salary_Cap || user.Salary_Cap === "N/A" ? "Salary Cap missing" : ""}${!user.in_time ? ", In Time missing" : ""}${!user.out_time ? ", Out Time missing" : ""}`);
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

      const allowedAbsences = 2, allowedLates = 3;
      const effectiveAbsentCount = Math.max(0, absentCount - officialLeaves);
      let adjustedWorkingDays = workingDays - Math.max(0, effectiveAbsentCount - allowedAbsences) + officialLeaves;
      let effectiveAllowanceDays = adjustedWorkingDays - Math.max(0, lateCount - allowedLates);
      effectiveAllowanceDays = Math.max(0, effectiveAllowanceDays);

      const hourlySalary = totalHoursDecimal * hourlyWage;
      const dailyAllowanceTotal = effectiveAllowanceDays * dailyAllowanceRate;
      const grossSalary = Math.min(hourlySalary + dailyAllowanceTotal, salaryCap);

      payrolls.push({
        employee_id: user.employee_id,
        full_name: user.full_name,
        month,
        total_working_hours: parseFloat(totalHoursDecimal.toFixed(2)),
        not_allowed_hours: parseFloat(notAllowedHours.toFixed(2)),
        official_working_days: workingDays,
        adjusted_working_days: adjustedWorkingDays,
        effective_allowance_days: effectiveAllowanceDays,
        hourly_wage: parseFloat(hourlyWage.toFixed(2)),
        daily_allowance_rate: parseFloat(dailyAllowanceRate.toFixed(2)),
        daily_allowance_total: parseFloat(dailyAllowanceTotal.toFixed(2)),
        official_leaves: officialLeaves,
        allowed_hours_per_day: allowedHoursPerDay,
        hourly_salary: parseFloat(hourlySalary.toFixed(2)),
        gross_salary: parseFloat(grossSalary.toFixed(2)),
        late_count: lateCount,
        early_count: earlyCount,
        absent_count: absentCount,
        effective_absent_count: effectiveAbsentCount,
        late_dates: lateDates,
        early_dates: earlyDates,
        absent_dates: absentDates,
        table_section_data: sectionData,
        Salary_Cap: salaryCap,
      });
    });

    if (issues.length > 0) console.log("Payroll Generation Issues:", issues);

    const result = await createPayrolls(payrolls);
    if (result.success) {
      setGeneratedPayrolls(result.data.reduce((acc, p) => ({ ...acc, [p.employee_id]: p }), {}));
      setIsPayrollModalOpen(false);
      showMessage("Payrolls created successfully");
    } else {
      setError(result.message);
    }
  };

  const handleGenerateSinglePayroll = async (user) => {
    if (!selectedFileId) {
      setError("Please select a file first.");
      return;
    }
    if (!payrollSettings.selectedMonth) {
      setError("Please select a month in the payroll settings.");
      return;
    }

    const month = `${payrollSettings.selectedMonth.getFullYear()}-${(payrollSettings.selectedMonth.getMonth() + 1).toString().padStart(2, "0")}`;
    const userIndex = tableData.findIndex((row) => row.length > 1 && row[0].trim() === "User ID" && row[1].trim() === user.employee_id);
    let totalWorkingHours = "0:00", lateCount = 0, earlyCount = 0, absentCount = 0, lateDates = [], earlyDates = [], absentDates = [], sectionData = [];

    if (userIndex !== -1) {
      const nextUserIdIndex = tableData.slice(userIndex + 1).findIndex((row) => row.length > 1 && row[0].trim() === "User ID");
      const endIndex = nextUserIdIndex === -1 ? tableData.length : userIndex + nextUserIdIndex + 1;
      sectionData = tableData.slice(userIndex, endIndex);
      const totalRow = sectionData.find((row) => row[0].trim() === "Total");
      if (totalRow && totalRow[14]) totalWorkingHours = totalRow[14].trim();

      const { lateCount: lc, earlyCount: ec, absentCount: ac, lateDates: ld, earlyDates: ed, absentDates: ad } = calculateLateEarlyAndAbsent(sectionData, user.employee_id);
      lateCount = lc; earlyCount = ec; absentCount = ac; lateDates = ld; earlyDates = ed; absentDates = ad;
    }

    if (!user.Salary_Cap || user.Salary_Cap === "N/A" || !user.in_time || !user.out_time) {
      setError(`Payroll not generated for ${user.full_name} (${user.employee_id}): ${!user.Salary_Cap || user.Salary_Cap === "N/A" ? "Salary Cap missing" : ""}${!user.in_time ? ", In Time missing" : ""}${!user.out_time ? ", Out Time missing" : ""}`);
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

    const allowedAbsences = 2, allowedLates = 3;
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
      total_working_hours: parseFloat(totalHoursDecimal.toFixed(2)),
      not_allowed_hours: parseFloat(notAllowedHours.toFixed(2)),
      official_working_days: workingDays,
      adjusted_working_days: adjustedWorkingDays,
      effective_allowance_days: effectiveAllowanceDays,
      hourly_wage: parseFloat(hourlyWage.toFixed(2)),
      daily_allowance_rate: parseFloat(dailyAllowanceRate.toFixed(2)),
      daily_allowance_total: parseFloat(dailyAllowanceTotal.toFixed(2)),
      official_leaves: officialLeaves,
      allowed_hours_per_day: allowedHoursPerDay,
      hourly_salary: parseFloat(hourlySalary.toFixed(2)),
      gross_salary: parseFloat(grossSalary.toFixed(2)),
      late_count: lateCount,
      early_count: earlyCount,
      absent_count: absentCount,
      effective_absent_count: effectiveAbsentCount,
      late_dates: lateDates,
      early_dates: earlyDates,
      absent_dates: absentDates,
      table_section_data: sectionData,
      Salary_Cap: salaryCap,
    };

    const result = await createPayrolls([payrollOutput]);
    if (result.success) {
      setGeneratedPayrolls((prev) => ({ ...prev, [user.employee_id]: result.data[0] }));
      showMessage(`Payroll generated for ${user.full_name}`);
    } else {
      setError(result.message);
    }
  };

  const handleUpdatePayroll = async () => {
    if (!editPayroll || !editPayroll.id) {
      setError("No payroll selected or invalid payroll ID");
      return;
    }

    const {
      total_working_hours,
      official_working_days,
      Salary_Cap,
      allowed_hours_per_day,
      late_count,
      absent_count,
      official_leaves,
      effective_allowance_days,
    } = editPayroll;

    const totalWorkingHours = parseFloat(total_working_hours) || 0;
    const workingDays = parseInt(official_working_days) || 0;
    const salaryCap = parseFloat(Salary_Cap) || 0;
    const allowedHoursPerDay = parseFloat(allowed_hours_per_day) || 8;
    const lateCount = parseInt(late_count) || 0;
    const absentCount = parseInt(absent_count) || 0;
    const officialLeaves = parseInt(official_leaves) || 0;
    const effectiveAllowanceDays = parseInt(effective_allowance_days) || 0;

    const allowedTotalHours = allowedHoursPerDay * workingDays;
    const notAllowedHours = totalWorkingHours > allowedTotalHours ? totalWorkingHours - allowedTotalHours : 0;
    const effectiveTotalHours = Math.min(totalWorkingHours, allowedTotalHours);

    const hourlyWage = totalWorkingHours > 0 ? (salaryCap / totalWorkingHours) / 2 : 0;
    const dailyAllowanceRate = salaryCap / workingDays / 2;
    const dailyAllowanceTotal = effectiveAllowanceDays * dailyAllowanceRate;

    const hourlySalary = effectiveTotalHours * hourlyWage;
    const grossSalary = Math.min(hourlySalary + dailyAllowanceTotal, salaryCap);

    const updatedPayroll = {
      ...editPayroll,
      total_working_hours: parseFloat(totalWorkingHours.toFixed(2)),
      not_allowed_hours: parseFloat(notAllowedHours.toFixed(2)),
      hourly_wage: parseFloat(hourlyWage.toFixed(2)),
      daily_allowance_rate: parseFloat(dailyAllowanceRate.toFixed(2)),
      daily_allowance_total: parseFloat(dailyAllowanceTotal.toFixed(2)),
      hourly_salary: parseFloat(hourlySalary.toFixed(2)),
      gross_salary: parseFloat(grossSalary.toFixed(2)),
    };

    const result = await updatePayroll(editPayroll.id, updatedPayroll);
    if (result.success) {
      setGeneratedPayrolls((prev) => ({
        ...prev,
        [editPayroll.employee_id]: updatedPayroll,
      }));
      setIsEditPayrollOpen(false);
      showMessage("Payroll updated successfully");
    } else {
      setError(result.message);
    }
  };

  const handleDeletePayroll = async (id, employeeId) => {
    const result = await deletePayroll(id);
    if (result.success) {
      setGeneratedPayrolls((prev) => {
        const updated = { ...prev };
        delete updated[employeeId];
        return updated;
      });
      showMessage("Payroll deleted successfully");
    } else {
      setError(result.message);
    }
  };

  const handleDeleteAllPayrolls = async () => {
    if (window.confirm("Are you sure you want to delete all payrolls?")) {
      const result = await deleteAllPayrolls();
      if (result.success) {
        setGeneratedPayrolls({});
        showMessage("All payrolls deleted successfully");
      } else {
        setError(result.message);
      }
    }
  };

  const handleTotalWorkingHoursChange = (e) => {
    const newTotalWorkingHours = parseFloat(e.target.value) || 0;
    const {
      official_working_days,
      Salary_Cap,
      allowed_hours_per_day,
      late_count,
      absent_count,
      official_leaves,
      effective_allowance_days,
    } = editPayroll;

    const workingDays = parseInt(official_working_days) || 0;
    const salaryCap = parseFloat(Salary_Cap) || 0;
    const allowedHoursPerDay = parseFloat(allowed_hours_per_day) || 8;
    const lateCount = parseInt(late_count) || 0;
    const absentCount = parseInt(absent_count) || 0;
    const officialLeaves = parseInt(official_leaves) || 0;
    const effectiveAllowanceDays = parseInt(effective_allowance_days) || 0;

    const allowedTotalHours = allowedHoursPerDay * workingDays;
    const notAllowedHours = newTotalWorkingHours > allowedTotalHours ? newTotalWorkingHours - allowedTotalHours : 0;
    const effectiveTotalHours = Math.min(newTotalWorkingHours, allowedTotalHours);

    const hourlyWage = newTotalWorkingHours > 0 ? (salaryCap / newTotalWorkingHours) / 2 : 0;
    const dailyAllowanceRate = salaryCap / workingDays / 2;
    const dailyAllowanceTotal = effectiveAllowanceDays * dailyAllowanceRate;

    const hourlySalary = effectiveTotalHours * hourlyWage;
    const grossSalary = Math.min(hourlySalary + dailyAllowanceTotal, salaryCap);

    setEditPayroll((prev) => ({
      ...prev,
      total_working_hours: parseFloat(newTotalWorkingHours.toFixed(2)),
      not_allowed_hours: parseFloat(notAllowedHours.toFixed(2)),
      hourly_wage: parseFloat(hourlyWage.toFixed(2)),
      daily_allowance_rate: parseFloat(dailyAllowanceRate.toFixed(2)),
      daily_allowance_total: parseFloat(dailyAllowanceTotal.toFixed(2)),
      hourly_salary: parseFloat(hourlySalary.toFixed(2)),
      gross_salary: parseFloat(grossSalary.toFixed(2)),
    }));
  };

  const rowVariants = { hidden: { opacity: 0, y: -5 }, visible: { opacity: 1, y: 0 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };
  const inputVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* File Selection Dropdown */}
      <div className="mb-6 flex items-center gap-4">
        <select
          value={selectedFileId || ""}
          onChange={handleFileChange}
          className="w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a File</option>
          {fileData.map((file) => (
            <option key={file.id} value={file.id}>
              {file.filename}
            </option>
          ))}
        </select>
        {selectedFileId && (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => deleteFile(selectedFileId)}
            className="bg-orange-500 text-white px-3 py-1 rounded-lg"
          >
            Delete File
          </motion.button>
        )}
      </div>

      {/* Error and Message Popups */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message.text}
          </motion.div>
        )}
        {(error || payrollError) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 p-4 rounded-lg shadow-lg bg-red-100 text-red-700"
          >
            {error || payrollError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payroll Table */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registered Users & Payrolls</h2>
        {usersError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4 text-sm">{usersError}</div>}
        {usersLoading || payrollLoading || loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Emp. ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Position</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const payroll = payrollData.find((p) => p.employee_id === user.employee_id) || generatedPayrolls[user.employee_id];
                  return (
                    <motion.tr key={user.id} variants={rowVariants} initial="hidden" animate="visible" className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.employee_id}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{user.post_applied_for}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm flex gap-2">
                        {payroll ? (
                          <>
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => { setSelectedUser(user); setIsShowPayrollOpen(true); }}
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FaEye /> Show
                            </motion.button>
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => { setEditPayroll(payroll); setIsEditPayrollOpen(true); }}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FaEdit /> Edit
                            </motion.button>
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleDeletePayroll(payroll.id, user.employee_id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FaTrash /> Delete
                            </motion.button>
                          </>
                        ) : (
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleGenerateSinglePayroll(user)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                          >
                            <FaPlus /> Generate
                          </motion.button>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {payroll ? <span className="text-green-600 font-semibold">Generated</span> : <span className="text-gray-600">Pending</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">Back</Link>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsPayrollModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
          >
            Payroll Generation
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleDeleteAllPayrolls}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Delete All Payrolls
          </motion.button>
        </div>
      </div>

      {/* Payroll Generation Modal */}
      <AnimatePresence>
        {isPayrollModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> Generate Payrolls</h3>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setIsPayrollModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-lg">✕</motion.button>
              </div>
              <div className="space-y-4">
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaCalendar className="text-blue-500" /> Select Month</label>
                  <DatePicker
                    selected={payrollSettings.selectedMonth}
                    onChange={(date) => setPayrollSettings((prev) => ({ ...prev, selectedMonth: date }))}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholderText="Pick a month"
                  />
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaClock className="text-purple-500" /> Working Days</label>
                  <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                    {payrollSettings.selectedMonth ? `Regular: ${calculateWorkingDays(payrollSettings.selectedMonth, false)}, Saturday Off: ${calculateWorkingDays(payrollSettings.selectedMonth, true)}` : "Select a month to see working days"}
                  </p>
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaUser className="text-orange-500" /> Saturday Off Employees</label>
                  <select
                    multiple
                    value={payrollSettings.saturdayOffEmployees}
                    onChange={(e) => setPayrollSettings((prev) => ({ ...prev, saturdayOffEmployees: Array.from(e.target.selectedOptions, (option) => option.value) }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 h-24"
                  >
                    {users.map((user) => (
                      <option key={user.employee_id} value={user.employee_id}>{user.full_name} ({user.employee_id})</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaLeaf className="text-green-500" /> Official Leaves</label>
                  <input
                    type="number"
                    value={payrollSettings.officialLeaves}
                    onChange={(e) => setPayrollSettings((prev) => ({ ...prev, officialLeaves: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter number of official leaves"
                  />
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaHourglass className="text-indigo-500" /> Allowed Hours/Day</label>
                  <input
                    type="number"
                    value={payrollSettings.allowedHoursPerDay}
                    onChange={(e) => setPayrollSettings((prev) => ({ ...prev, allowedHoursPerDay: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Default: 8"
                    min="1"
                    max="24"
                  />
                </motion.div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setIsPayrollModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</motion.button>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleGenerateAllPayrolls} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"><FaMoneyBillWave /> Generate</motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payroll Slip Modal with Table Section Data */}
      <AnimatePresence>
        {isShowPayrollOpen && selectedUser && (generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Techmire Solution Logo" className="h-12 w-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Techmire Solution</h3>
                    <h4 className="text-sm text-gray-600">Payroll Slip</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PDFDownloadLink
                    document={<PayrollSlipPDF payroll={generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)} />}
                    fileName={`Payroll_Slip_${(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).employee_id}_${(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).month}.pdf`}
                  >
                    {({ loading }) => (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1 text-sm disabled:bg-gray-400"
                      >
                        <FaDownload /> {loading ? "Generating..." : "Download"}
                      </motion.button>
                    )}
                  </PDFDownloadLink>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setIsShowPayrollOpen(false)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-1 text-sm"
                  >
                    <FaEye /> Close
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Employee Details</h5>
                <table className="w-full text-xs border">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Employee ID</td>
                      <td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).employee_id}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-semibold">Name</td>
                      <td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).full_name}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Month</td>
                      <td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).month}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Payroll Summary</h5>
                <table className="w-full text-xs border">
                  <tbody>
                    <tr className="border-b"><td className="p-2 font-semibold">Total Working Hours</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).total_working_hours} hrs</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Not Allowed Hours</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).not_allowed_hours} hrs</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Official Working Days</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).official_working_days}</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Adjusted Working Days</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).adjusted_working_days}</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Effective Allowance Days</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).effective_allowance_days}</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Hourly Wage</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).hourly_wage} PKR/hr</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Daily Allowance Rate</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).daily_allowance_rate} PKR/day</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Daily Allowance Total</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).daily_allowance_total} PKR</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Official Leaves</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).official_leaves}</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Allowed Hours/Day</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).allowed_hours_per_day} hrs</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Hourly Salary</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).hourly_salary} PKR</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Gross Salary</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).gross_salary} PKR</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Late Count</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).late_count}</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Absent Count</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).absent_count}</td></tr>
                    <tr className="border-b"><td className="p-2 font-semibold">Effective Absent Count</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).effective_absent_count}</td></tr>
                    <tr><td className="p-2 font-semibold">Salary Cap</td><td className="p-2">{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).Salary_Cap} PKR</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Attendance Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-xs font-semibold text-gray-600 mb-1">Late Dates</h6>
                    {(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).late_dates.length > 0 ? (
                      <table className="w-full text-xs border">
                        <thead><tr className="bg-gray-100"><th className="p-1 font-semibold">#</th><th className="p-1 font-semibold">Date</th></tr></thead>
                        <tbody>{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).late_dates.map((date, index) => (
                          <tr key={index} className="border-b"><td className="p-1 text-center">{index + 1}</td><td className="p-1">{date}</td></tr>
                        ))}</tbody>
                      </table>
                    ) : <p className="text-xs text-gray-500 italic">No late dates</p>}
                  </div>
                  <div>
                    <h6 className="text-xs font-semibold text-gray-600 mb-1">Absent Dates</h6>
                    {(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).absent_dates.length > 0 ? (
                      <table className="w-full text-xs border">
                        <thead><tr className="bg-gray-100"><th className="p-1 font-semibold">#</th><th className="p-1 font-semibold">Date</th></tr></thead>
                        <tbody>{(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).absent_dates.map((date, index) => (
                          <tr key={index} className="border-b"><td className="p-1 text-center">{index + 1}</td><td className="p-1">{date}</td></tr>
                        ))}</tbody>
                      </table>
                    ) : <p className="text-xs text-gray-500 italic">No absent dates</p>}
                  </div>
                </div>
              </div>

              {/* Table Section Data */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Attendance Records</h5>
                {(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).table_section_data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[8px] border">
                      <thead className="bg-orange-500">
                        <tr>
                          <th className="p-1 font-semibold border-r">Date</th>
                          <th className="p-1 font-semibold border-r">Day</th>
                          <th className="p-1 font-semibold border-r">In Time</th>
                          <th className="p-1 font-semibold border-r">Out Time</th>
                          <th className="p-1 font-semibold">Total Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(generatedPayrolls[selectedUser.employee_id] || payrollData.find((p) => p.employee_id === selectedUser.employee_id)).table_section_data
                          .filter(row => row[0] !== "User ID" && row[0] !== "Total") // Filter out header and total rows
                          .map((row, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-1 border-r">{row[0]}</td>
                              <td className="p-1 border-r">{row[1]}</td>
                              <td className="p-1 border-r">{row[4]}</td>
                              <td className="p-1 border-r">{row[6]}</td>
                              <td className="p-1">{row[14]}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No attendance records available</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Payroll Modal */}
      <AnimatePresence>
        {isEditPayrollOpen && editPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><FaEdit className="text-yellow-500" /> Edit Payroll</h3>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setIsEditPayrollOpen(false)} className="text-gray-500 hover:text-gray-700 text-lg">✕</motion.button>
              </div>
              <div className="space-y-4">
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Working Hours</label>
                  <input
                    type="number"
                    value={editPayroll.total_working_hours}
                    onChange={handleTotalWorkingHoursChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary (PKR)</label>
                  <input
                    type="number"
                    value={editPayroll.gross_salary}
                    disabled
                    className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700"
                  />
                </motion.div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setIsEditPayrollOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</motion.button>
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleUpdatePayroll} className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2"><FaEdit /> Update</motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList;