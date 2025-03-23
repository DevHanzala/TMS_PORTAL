// models/exEmployeeModel.js
import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../DB/DBconnection.js";

const ExEmployee = sequelize.define(
  "ExEmployee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    post_applied_for: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    permanent_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institute: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    exit_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    teaching_subjects: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teaching_institute: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teaching_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    in_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    out_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Salary_Cap: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    guardian_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reference_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    has_disease: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disease_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false, // No createdAt/updatedAt fields needed
    tableName: "exemployees",
  }
);

export default ExEmployee;