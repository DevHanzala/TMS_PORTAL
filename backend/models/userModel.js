import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DBconnection.js";

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true,
    comment: "Unique identifier for each user, auto-incremented"
  },
  employee_id: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: { name: "unique_employee_id" },
    comment: "Unique employee ID assigned to the user"
  },
  registration_date: { 
    type: DataTypes.DATE, 
    allowNull: false,
    comment: "Date when the user registered"
  },
  joining_date: { 
    type: DataTypes.DATE, 
    allowNull: false,
    comment: "Date when the user joined the organization"
  },
  post_applied_for: { 
    type: DataTypes.ENUM("Employee", "Internship"), 
    allowNull: false,
    // comment: "Position applied for: Employee or Internship" // Simplified comment
  },
  full_name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Full name of the user"
  },
  gender: { 
    type: DataTypes.ENUM("Male", "Female"), 
    allowNull: false,
    // comment: "Gender of the user" // Simplified to avoid confusion
  },
  cnic: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: { name: "unique_cnic" },
    comment: "Unique 13-digit CNIC number"
  },
  dob: { 
    type: DataTypes.DATE, 
    allowNull: false,
    comment: "Date of birth of the user"
  },
  permanent_address: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Permanent address of the user"
  },
  contact_number: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Contact number of the user"
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: { name: "unique_email" },
    validate: { isEmail: true },
    comment: "Unique email address of the user"
  },
  image: { 
    type: DataTypes.BLOB("long"), 
    allowNull: true,
    comment: "Profile image stored as binary data (JPEG)"
  },
  degree: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Educational degree earned by the user"
  },
  institute: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Institute where the degree was earned"
  },
  grade: { 
    type: DataTypes.STRING, 
    allowNull: false,
    comment: "Grade or GPA achieved"
  },
  year: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    comment: "Year of degree completion"
  },
  teaching_subjects: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Subjects taught by the user (if applicable)"
  },
  teaching_institute: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Institute where teaching occurred (if applicable)"
  },
  teaching_contact: { 
    type: DataTypes.STRING, 
    allowNull: true,
    validate: {
      len: [0, 11],
      isNumeric: (val) => !val || /^\d+$/.test(val),
    },
    comment: "Contact for teaching reference (11 digits if provided, optional)"
  },
  position: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Current or past job position (if applicable)"
  },
  organization: { 
    type: DataTypes.STRING, 
    allowNull: true,
    comment: "Organization of past/current employment (if applicable)"
  },
  skills: { 
    type: DataTypes.JSON, 
    allowNull: true,
    validate: { 
      isValidSkills(value) {
        if (value && (!Array.isArray(value) || value.length > 5)) {
          throw new Error("Skills must be an array with a maximum of 5 items.");
        }
      }
    },
    comment: "Array of up to 5 professional skills (optional)"
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    comment: "Additional description or notes about the user (optional)"
  },
  in_time: { 
    type: DataTypes.TIME, 
    allowNull: false,
    comment: "Daily start time of the user’s work shift (e.g., '09:00:00')"
  },
  out_time: { 
    type: DataTypes.TIME, 
    allowNull: false,
    comment: "Daily end time of the user’s work shift (e.g., '17:00:00')"
  },
  Salary_Cap: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
    comment: "Salary capacity of the user in whole currency units (e.g., 50000)"
  },
}, {
  timestamps: true,
  tableName: "users", // Explicitly set to "users"
  comment: "Table storing user data with timestamps for creation and updates"
});

export default User;