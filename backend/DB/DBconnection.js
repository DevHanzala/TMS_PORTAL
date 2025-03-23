import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// PostgreSQL Database Connection using Sequelize
// All config comes from .env
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false, // Disable SQL query logging
  pool: { // Connection pool for efficiency
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Function to test and establish database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Verify connection to PostgreSQL
    console.log("✅ PostgreSQL Connected Successfully");

    // Changed: Sync models without forcing, creates tables if they don’t exist
    await sequelize.sync(); // Lazy creation: tables are made when models are used
    console.log("✅ Database models synced (tables created if needed)");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// Call connectDB at startup to ensure connection, but tables sync lazily
connectDB();

export { sequelize, connectDB };