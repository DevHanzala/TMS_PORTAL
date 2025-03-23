import React, { useEffect, useState } from "react";
import { useUserStore } from "../Store/userStore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Edit2,
  X,
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
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import UserPDF from "../Components/UserPDF";

const AllRegisteredUsers = () => {
  const { users, fetchUsers, deleteUser, updateUser, loading, error } =
    useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null); // State for delete popup

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...editingUser };
      if (editingUser.image instanceof File) {
        updatedData.image = editingUser.image;
      }
      await updateUser(editingUser.id, updatedData);
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingUser((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleDeleteClick = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      setDeleteMessage(`Deleting ${userName}...`); // Show loading message
      try {
        // Simulate loading delay (e.g., 1.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await deleteUser(userId); // Perform the delete action
        setDeleteMessage(`${userName} has been successfully deleted!`); // Success message
        setTimeout(() => {
          setDeleteMessage(null); // Hide message after 2 seconds
          fetchUsers(); // Refresh the user list
        }, 2000);
      } catch (error) {
        console.error("Error deleting user:", error);
        setDeleteMessage("Failed to delete user.");
        setTimeout(() => setDeleteMessage(null), 2000);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Registered Employees
        </h2>
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

      {/* Delete Popup Message */}
      <AnimatePresence>
        {deleteMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg z-50"
          >
            {deleteMessage.includes("Deleting") && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
                {deleteMessage}
              </div>
            )}
            {!deleteMessage.includes("Deleting") && deleteMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
                  Position
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {user.employee_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.full_name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <User className="h-8 w-8 text-gray-400 mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {user.post_applied_for}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleViewClick(user)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id, user.full_name)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
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

      <Link
        to="/register"
        className="inline-block mt-8 px-6 py-2 bg-[oklch(0.67_0.19_42.13)] text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
      >
        Back to Registration
      </Link>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && viewingUser && (
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
                  Employee Details
                </h3>
                <div className="flex items-center space-x-4">
                  <PDFDownloadLink
                    document={<UserPDF user={viewingUser} />}
                    fileName={`${viewingUser.full_name}-details.pdf`}
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
                    {viewingUser.image ? (
                      <img
                        src={viewingUser.image}
                        alt={viewingUser.full_name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {viewingUser.full_name}
                      </h4>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {viewingUser.post_applied_for}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Employee ID</p>
                        <p className="font-medium">{viewingUser.employee_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{viewingUser.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">CNIC</p>
                        <p className="font-medium">{viewingUser.cnic}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{viewingUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{viewingUser.contact_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Contact className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Guardian Phone</p>
                        <p className="font-medium">{viewingUser.guardian_phone}</p>
                      </div>
                    </div>
                    {viewingUser.in_time && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">In Time</p>
                          <p className="font-medium">{viewingUser.in_time}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.out_time && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Out Time</p>
                          <p className="font-medium">{viewingUser.out_time}</p>
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
                          {new Date(viewingUser.dob).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Registration Date</p>
                        <p className="font-medium">
                          {new Date(viewingUser.registration_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Joining Date</p>
                        <p className="font-medium">
                          {new Date(viewingUser.joining_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {viewingUser.Salary_Cap && (
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Salary Cap</p>
                          <p className="font-medium">{viewingUser.Salary_Cap}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Degree</p>
                        <p className="font-medium">{viewingUser.degree}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Institute</p>
                        <p className="font-medium">{viewingUser.institute}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Has Disease</p>
                        <p className="font-medium">{viewingUser.has_disease}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Permanent Address</p>
                        <p className="font-medium">{viewingUser.permanent_address}</p>
                      </div>
                    </div>
                    {viewingUser.teaching_subjects && (
                      <div className="flex items-start space-x-3">
                        <GraduationCap className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Teaching Subjects</p>
                          <p className="font-medium">{viewingUser.teaching_subjects}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.teaching_institute && (
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Teaching Institute</p>
                          <p className="font-medium">{viewingUser.teaching_institute}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.teaching_contact && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Teaching Contact</p>
                          <p className="font-medium">{viewingUser.teaching_contact}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.position && (
                      <div className="flex items-start space-x-3">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Position</p>
                          <p className="font-medium">{viewingUser.position}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.organization && (
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Organization</p>
                          <p className="font-medium">{viewingUser.organization}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.skills && (
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Skills</p>
                          <p className="font-medium">
                            {viewingUser.skills.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                    {viewingUser.description && (
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium">{viewingUser.description}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.reference_name && (
                      <div className="flex items-start space-x-3">
                        <UserPlus className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Reference Name</p>
                          <p className="font-medium">{viewingUser.reference_name}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.reference_contact && (
                      <div className="flex items-start space-x-3">
                        <PhoneCall className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Reference Contact</p>
                          <p className="font-medium">{viewingUser.reference_contact}</p>
                        </div>
                      </div>
                    )}
                    {viewingUser.disease_description && (
                      <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Disease Description</p>
                          <p className="font-medium">{viewingUser.disease_description}</p>
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

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-semibold">Edit Employee Details</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={editingUser.full_name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employee_id"
                      value={editingUser.employee_id}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editingUser.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Applied For
                    </label>
                    <input
                      type="text"
                      name="post_applied_for"
                      value={editingUser.post_applied_for}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editingUser.gender}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={editingUser.cnic}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={editingUser.dob.split("T")[0]}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      value={editingUser.contact_number}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Phone
                    </label>
                    <input
                      type="text"
                      name="guardian_phone"
                      value={editingUser.guardian_phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Date
                    </label>
                    <input
                      type="date"
                      name="registration_date"
                      value={editingUser.registration_date.split("T")[0]}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      name="joining_date"
                      value={editingUser.joining_date.split("T")[0]}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {editingUser.in_time && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        In Time
                      </label>
                      <input
                        type="time"
                        name="in_time"
                        value={editingUser.in_time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.out_time && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Out Time
                      </label>
                      <input
                        type="time"
                        name="out_time"
                        value={editingUser.out_time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.Salary_Cap && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Cap
                      </label>
                      <input
                        type="number"
                        name="Salary_Cap"
                        value={editingUser.Salary_Cap}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={editingUser.degree}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institute
                    </label>
                    <input
                      type="text"
                      name="institute"
                      value={editingUser.institute}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={editingUser.grade}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={editingUser.year}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Name
                    </label>
                    <input
                      type="text"
                      name="reference_name"
                      value={editingUser.reference_name || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reference Contact
                    </label>
                    <input
                      type="text"
                      name="reference_contact"
                      value={editingUser.reference_contact || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Has Disease
                    </label>
                    <select
                      name="has_disease"
                      value={editingUser.has_disease}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disease Description
                    </label>
                    <input
                      type="text"
                      name="disease_description"
                      value={editingUser.disease_description || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {editingUser.teaching_subjects && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teaching Subjects
                      </label>
                      <input
                        type="text"
                        name="teaching_subjects"
                        value={editingUser.teaching_subjects}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.teaching_institute && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teaching Institute
                      </label>
                      <input
                        type="text"
                        name="teaching_institute"
                        value={editingUser.teaching_institute}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.teaching_contact && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teaching Contact
                      </label>
                      <input
                        type="text"
                        name="teaching_contact"
                        value={editingUser.teaching_contact}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.position && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={editingUser.position}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.organization && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={editingUser.organization}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {editingUser.skills && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={editingUser.skills}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Scrum, Kanban, Agile"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permanent Address
                    </label>
                    <textarea
                      name="permanent_address"
                      value={editingUser.permanent_address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {editingUser.description && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editingUser.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[oklch(0.67_0.19_42.13)] text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllRegisteredUsers;