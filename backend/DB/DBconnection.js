import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// PostgreSQL Database Connection using Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false, // Disable SQL query logging
});

// Function to test and establish database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Verify connection to PostgreSQL
    console.log("✅ PostgreSQL Connected Successfully");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

export { sequelize, connectDB };