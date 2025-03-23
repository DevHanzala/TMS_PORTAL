import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Eye,
  Download,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  CreditCard,
  Building,
  Users,
  Clock,
  GraduationCap,
  DollarSign,
  FileText,
  Contact,
  UserPlus,
  PhoneCall,
  Heart,
  X,
} from "lucide-react";
import { useExEmployeeStore } from "../Store/exEmployeeStore"; // Import ex-employee store
import { PDFDownloadLink } from "@react-pdf/renderer";
import UserPDF from "../Components/UserPDF"; // Import UserPDF from new file

const ExEmployeePage = () => {
  const { exEmployees, fetchExEmployees, deleteExEmployee, loading, error } =
    useExEmployeeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingExEmployee, setViewingExEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchExEmployees();
  }, [fetchExEmployees]);

  const handleViewClick = (exEmployee) => {
    setViewingExEmployee(exEmployee);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = async (exEmployeeId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this ex-employee?")
    ) {
      await deleteExEmployee(exEmployeeId);
    }
  };

  const filteredExEmployees = exEmployees.filter(
    (exEmployee) =>
      exEmployee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exEmployee.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="container min-h-[60vh] mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ex-Employees</h2>
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto bg-white rounded-lg shadow"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[oklch(0.67_0.19_42.13)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Exit Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredExEmployees.map((exEmployee) => (
                  <motion.tr
                    key={exEmployee.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exEmployee.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exEmployee.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(exEmployee.exit_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleViewClick(exEmployee)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <PDFDownloadLink
                          document={<UserPDF user={exEmployee} />}
                          fileName={`${exEmployee.full_name}-ex-employee-details.pdf`}
                          className="text-green-600 hover:text-green-900 cursor-pointer"
                          title="Download PDF"
                        >
                          {({ loading }) =>
                            loading ? "Generating..." : <Download className="h-5 w-5" />
                          }
                        </PDFDownloadLink>
                        <button
                          onClick={() => handleDeleteClick(exEmployee.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          title="Delete Ex-Employee"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Enhanced View Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewingExEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Ex-Employee Details
                </h3>
                <div className="flex items-center space-x-4">
                  <PDFDownloadLink
                    document={<UserPDF user={viewingExEmployee} />}
                    fileName={`${viewingExEmployee.full_name}-ex-employee-details.pdf`}
                    className="flex items-center px-4 py-2 bg-[oklch(0.67_0.19_42.13)] text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    {({ loading }) => (
                      <>
                        <Download className="h-5 w-5 mr-2" />
                        {loading ? "Generating PDF..." : "Download PDF"}
                      </>
                    )}
                  </PDFDownloadLink>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2 flex items-center space-x-4">
                    {viewingExEmployee.image ? (
                      <img
                        src={viewingExEmployee.image}
                        alt={viewingExEmployee.full_name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {viewingExEmployee.full_name}
                      </h4>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {viewingExEmployee.post_applied_for}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Employee ID</p>
                        <p className="font-medium">{viewingExEmployee.employee_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{viewingExEmployee.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">CNIC</p>
                        <p className="font-medium">{viewingExEmployee.cnic}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{viewingExEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{viewingExEmployee.contact_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Contact className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Guardian Phone</p>
                        <p className="font-medium">{viewingExEmployee.guardian_phone}</p>
                      </div>
                    </div>
                    {viewingExEmployee.in_time && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">In Time</p>
                          <p className="font-medium">{viewingExEmployee.in_time}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.out_time && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Out Time</p>
                          <p className="font-medium">{viewingExEmployee.out_time}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {new Date(viewingExEmployee.dob).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Registration Date</p>
                        <p className="font-medium">
                          {new Date(viewingExEmployee.registration_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Joining Date</p>
                        <p className="font-medium">
                          {new Date(viewingExEmployee.joining_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Exit Date</p>
                        <p className="font-medium">
                          {new Date(viewingExEmployee.exit_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {viewingExEmployee.Salary_Cap && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Salary Cap</p>
                          <p className="font-medium">{viewingExEmployee.Salary_Cap}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Degree</p>
                        <p className="font-medium">{viewingExEmployee.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Institute</p>
                        <p className="font-medium">{viewingExEmployee.institute}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Has Disease</p>
                        <p className="font-medium">{viewingExEmployee.has_disease}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Permanent Address</p>
                        <p className="font-medium">{viewingExEmployee.permanent_address}</p>
                      </div>
                    </div>
                    {viewingExEmployee.teaching_subjects && (
                      <div className="flex items-start space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Teaching Subjects</p>
                          <p className="font-medium">{viewingExEmployee.teaching_subjects}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.teaching_institute && (
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Teaching Institute</p>
                          <p className="font-medium">{viewingExEmployee.teaching_institute}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.teaching_contact && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Teaching Contact</p>
                          <p className="font-medium">{viewingExEmployee.teaching_contact}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.position && (
                      <div className="flex items-start space-x-3">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Position</p>
                          <p className="font-medium">{viewingExEmployee.position}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.organization && (
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Organization</p>
                          <p className="font-medium">{viewingExEmployee.organization}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.skills && (
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Skills</p>
                          <p className="font-medium">
                            {Array.isArray(viewingExEmployee.skills)
                              ? viewingExEmployee.skills.join(", ")
                              : viewingExEmployee.skills}
                          </p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.description && (
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium">{viewingExEmployee.description}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.reference_name && (
                      <div className="flex items-start space-x-3">
                        <UserPlus className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Reference Name</p>
                          <p className="font-medium">{viewingExEmployee.reference_name}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.reference_contact && (
                      <div className="flex items-start space-x-3">
                        <PhoneCall className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Reference Contact</p>
                          <p className="font-medium">{viewingExEmployee.reference_contact}</p>
                        </div>
                      </div>
                    )}
                    {viewingExEmployee.disease_description && (
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Disease Description</p>
                          <p className="font-medium">{viewingExEmployee.disease_description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExEmployeePage;