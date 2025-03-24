// Import required dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize, connectDB } from "./DB/DBconnection.js";

// Import models
import "./models/userModel.js";
import "./models/fileModel.js";
import "./models/exEmployeeModel.js"; // Register ExEmployee model
import "./models/payrollModel.js";    // Register Payroll model
import "./models/hrUsers.js";  


// Import routes
import userRoutes from "./routes/userRoute.js";
import fileRoutes from "./routes/fileRoute.js";
import authRoutes from "./routes/authRoute.js";
import exEmployeeRoutes from "./routes/exEmployeeRoute.js"; // Ex-employee routes
import payrollRoutes from "./routes/payrollRoute.js";      // Payroll routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));                // Enable CORS with specified options
app.use(express.json({ limit: "50mb" }));  // Parse JSON bodies with size limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Parse URL-encoded bodies

// Register API routes
app.use("/api/users", userRoutes);         // User-related routes
app.use("/api/files", fileRoutes);         // File-related routes
app.use("/api/auth", authRoutes);          // Authentication routes
app.use("/api/exemployees", exEmployeeRoutes); // Ex-employee routes
app.use("/api/payrolls", payrollRoutes);   // Payroll routes

// Root endpoint
app.get("/", (req, res) => {
  res.send("MERN Backend with PostgreSQL is Running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDB(); // Connect to the database
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
  }
});