import express from "express";
import { getUsers, registerUser, updateUser, deleteUser } from "../controllers/userController.js";
import multer from "multer";

// Configure Multer to store images in memory as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Routes
router.get("/", getUsers);
router.post("/upload", upload.single("image"), registerUser); // Handle image upload
router.put("/:id", upload.single("image"), updateUser); // Handle image update
router.delete("/:id", deleteUser);

export default router;