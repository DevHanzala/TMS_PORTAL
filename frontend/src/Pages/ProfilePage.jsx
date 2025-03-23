import React from "react";
import { useAuthStore } from "../Store/authStore";
import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaPhone, 
  FaHome, 
  FaBirthdayCake, 
  FaVenusMars, 
  FaClock, 
  FaMoneyBillWave, 
  FaBuilding, 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaTools, 
  FaFileAlt,
  FaPhoneSquare, // Added for guardian_phone
  FaUserPlus,    // Added for reference_name
  FaPhoneVolume, // Added for reference_contact
  FaHeartbeat    // Added for has_disease/disease_description
} from "react-icons/fa";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <div className="text-center text-red-500 p-4">Please log in to view your profile.</div>;
  }

  // Debug: Log the full user object
  console.log("User data:", user);

  // Check if user is HR (minimal data) or employee (full data)
  const isHR = user.role === "hr";

  // Format dates
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");

  // Helper to check if a field should be displayed
  const shouldDisplay = (value) => value && value !== "N/A" && value !== "";

  if (isHR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Profile</h1>
          <div className="space-y-4">
            <ProfileItem icon={<FaUser />} label="Role" value={user.role} />
            <p className="text-gray-600 text-center italic text-sm">HR users have limited profile details.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Destructure user object for employee with new fields
  const {
    employee_id,
    registration_date,
    joining_date,
    post_applied_for,
    full_name,
    gender,
    cnic,
    dob,
    permanent_address,
    contact_number,
    email,
    degree,
    institute,
    grade,
    year,
    teaching_subjects,
    teaching_institute,
    teaching_contact,
    position,
    organization,
    skills,
    description,
    in_time,
    out_time,
    Salary_Cap,
    role,
    image,
    guardian_phone,      // Added: New field
    reference_name,      // Added: New field
    reference_contact,   // Added: New field
    has_disease,         // Added: New field
    disease_description, // Added: New field
  } = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-4xl flex flex-col md:flex-row gap-3"
      >
        {/* Left Section: Image and Basic Info */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center">
          {shouldDisplay(image) ? (
            <img
              src={image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-orange-500 shadow-md mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/128";
                console.error("Image failed to load:", image);
              }}
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shadow-md mb-4">
              <FaUser size={40} />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-800 text-center">{full_name || "Unnamed User"}</h2>
          {shouldDisplay(role) && <p className="text-gray-600 text-sm">{role}</p>}
          {shouldDisplay(employee_id) && <p className="text-gray-500 text-sm mt-1">ID: {employee_id}</p>}
        </div>

        {/* Right Section: Details */}
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">Profile Details</h1>

          {/* Personal Information */}
          {(shouldDisplay(email) || shouldDisplay(cnic) || shouldDisplay(contact_number) || shouldDisplay(permanent_address) || shouldDisplay(dob) || shouldDisplay(gender) || shouldDisplay(guardian_phone) || shouldDisplay(reference_name) || shouldDisplay(reference_contact) || shouldDisplay(has_disease) || shouldDisplay(disease_description)) && (
            <Section title="Personal Info">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shouldDisplay(email) && <ProfileItem icon={<FaEnvelope />} label="Email" value={email} />}
                {shouldDisplay(cnic) && <ProfileItem icon={<FaIdCard />} label="CNIC" value={cnic} />}
                {shouldDisplay(contact_number) && <ProfileItem icon={<FaPhone />} label="Contact" value={contact_number} />}
                {shouldDisplay(permanent_address) && <ProfileItem icon={<FaHome />} label="Address" value={permanent_address} />}
                {shouldDisplay(dob) && <ProfileItem icon={<FaBirthdayCake />} label="DOB" value={formatDate(dob)} />}
                {shouldDisplay(gender) && <ProfileItem icon={<FaVenusMars />} label="Gender" value={gender} />}
                {shouldDisplay(guardian_phone) && <ProfileItem icon={<FaPhoneSquare />} label="Guardian Phone" value={guardian_phone} />}
                {shouldDisplay(reference_name) && <ProfileItem icon={<FaUserPlus />} label="Reference Name" value={reference_name} />}
                {shouldDisplay(reference_contact) && <ProfileItem icon={<FaPhoneVolume />} label="Reference Contact" value={reference_contact} />}
                {shouldDisplay(has_disease) && <ProfileItem icon={<FaHeartbeat />} label="Has Disease" value={has_disease} />}
                {shouldDisplay(disease_description) && <ProfileItem icon={<FaHeartbeat />} label="Disease Description" value={disease_description} />}
              </div>
            </Section>
          )}

          {/* Employment Details */}
          {(shouldDisplay(post_applied_for) || shouldDisplay(registration_date) || shouldDisplay(joining_date) || shouldDisplay(in_time) || shouldDisplay(out_time) || shouldDisplay(Salary_Cap) || shouldDisplay(position) || shouldDisplay(organization)) && (
            <Section title="Employment">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shouldDisplay(post_applied_for) && <ProfileItem icon={<FaFileAlt />} label="Post" value={post_applied_for} />}
                {shouldDisplay(registration_date) && <ProfileItem icon={<FaClock />} label="Reg. Date" value={formatDate(registration_date)} />}
                {shouldDisplay(joining_date) && <ProfileItem icon={<FaClock />} label="Join Date" value={formatDate(joining_date)} />}
                {shouldDisplay(in_time) && <ProfileItem icon={<FaClock />} label="In Time" value={in_time} />}
                {shouldDisplay(out_time) && <ProfileItem icon={<FaClock />} label="Out Time" value={out_time} />}
                {shouldDisplay(Salary_Cap) && <ProfileItem icon={<FaMoneyBillWave />} label="Salary" value={Salary_Cap.toLocaleString()} />}
                {shouldDisplay(position) && <ProfileItem icon={<FaBuilding />} label="Position" value={position} />}
                {shouldDisplay(organization) && <ProfileItem icon={<FaBuilding />} label="Organization" value={organization} />}
              </div>
            </Section>
          )}

          {/* Education */}
          {(shouldDisplay(degree) || shouldDisplay(institute) || shouldDisplay(grade) || shouldDisplay(year)) && (
            <Section title="Education">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shouldDisplay(degree) && <ProfileItem icon={<FaGraduationCap />} label="Degree" value={degree} />}
                {shouldDisplay(institute) && <ProfileItem icon={<FaBuilding />} label="Institute" value={institute} />}
                {shouldDisplay(grade) && <ProfileItem icon={<FaGraduationCap />} label="Grade" value={grade} />}
                {shouldDisplay(year) && <ProfileItem icon={<FaClock />} label="Year" value={year} />}
              </div>
            </Section>
          )}

          {/* Teaching Experience */}
          {(shouldDisplay(teaching_subjects) || shouldDisplay(teaching_institute) || shouldDisplay(teaching_contact)) && (
            <Section title="Teaching">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shouldDisplay(teaching_subjects) && <ProfileItem icon={<FaChalkboardTeacher />} label="Subjects" value={teaching_subjects} />}
                {shouldDisplay(teaching_institute) && <ProfileItem icon={<FaBuilding />} label="Institute" value={teaching_institute} />}
                {shouldDisplay(teaching_contact) && <ProfileItem icon={<FaPhone />} label="Contact" value={teaching_contact} />}
              </div>
            </Section>
          )}

          {/* Additional Information */}
          {(shouldDisplay(skills) || shouldDisplay(description)) && (
            <Section title="Additional">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shouldDisplay(skills) && <ProfileItem icon={<FaTools />} label="Skills" value={Array.isArray(skills) ? skills.join(", ") : skills} />}
                {shouldDisplay(description) && <ProfileItem icon={<FaFileAlt />} label="Description" value={description} />}
              </div>
            </Section>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    {children}
  </div>
);

// Reusable Profile Item Component
const ProfileItem = ({ icon, label, value }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="flex items-center space-x-3 bg-white p-2 rounded-md shadow-sm border border-gray-200"
  >
    <span className="text-orange-500">{icon}</span>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 font-semibold truncate" title={value}>{value}</p>
    </div>
  </motion.div>
);

export default ProfilePage;