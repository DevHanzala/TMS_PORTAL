import { DataTypes } from "sequelize";
import { sequelize } from "../DB/DBconnection.js";

// Define the Payroll model
const Payroll = sequelize.define(
  "Payroll",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING, // Format: YYYY-MM
      allowNull: false,
    },
    total_working_hours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    not_allowed_hours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    official_working_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    adjusted_working_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    effective_allowance_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    hourly_wage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    daily_allowance_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    daily_allowance_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    official_leaves: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    allowed_hours_per_day: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 8,
    },
    hourly_salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    gross_salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    late_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    early_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    absent_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    effective_absent_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    late_dates: {
      type: DataTypes.JSON, // Store as JSON array
      allowNull: false,
      defaultValue: [],
    },
    early_dates: {
      type: DataTypes.JSON, // Store as JSON array
      allowNull: false,
      defaultValue: [],
    },
    absent_dates: {
      type: DataTypes.JSON, // Store as JSON array
      allowNull: false,
      defaultValue: [],
    },
    table_section_data: {
      type: DataTypes.JSON, // Store as JSON array of arrays
      allowNull: false,
      defaultValue: [],
    },
    Salary_Cap: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: "payrolls", // Explicit table name
  }
);

// Sync the model with the database (optional, can be done in DBconnection.js)
Payroll.sync({ force: false })
  .then(() => console.log("Payroll table synced successfully"))
  .catch((err) => console.error("Error syncing Payroll table:", err));

export default Payroll;