import { useEffect } from "react";
import usePayrollStore from "../Store/payrollStore";

const UserList = ({ selectedFileId }) => {  // Change prop name
  const { payrollData, fetchPayrollData } = usePayrollStore();

  useEffect(() => {
    if (selectedFileId) {  // Use correct prop name
      fetchPayrollData(selectedFileId);
      console.log("Fetching Payroll Data for File ID:", selectedFileId);
    }
  }, [selectedFileId]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Payroll List</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Employee Name</th>
            <th className="py-2 px-4 border">Employee ID</th>
            <th className="py-2 px-4 border">Salary</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Month</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.length > 0 ? (
            payrollData.map((item, index) => (
              <tr key={index} className="text-center border-b">
                <td className="py-2 px-4">{item.employee_name}</td>
                <td className="py-2 px-4">{item.employee_id}</td>
                <td className="py-2 px-4">${item.salary}</td>
                <td className="py-2 px-4">{item.department}</td>
                <td className="py-2 px-4">{item.month}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-gray-500">
                No payroll data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
