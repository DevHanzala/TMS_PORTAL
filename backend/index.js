import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize, connectDB } from "./DB/DBconnection.js";
import userRoutes from "./routes/userRoute.js";
import fileRoutes from "./routes/fileRoute.js";
import authRoutes from "./routes/authRoute.js"; // Add this

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes); // Add this

app.get("/", (req, res) => {
  res.send("MERN Backend with PostgreSQL is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));