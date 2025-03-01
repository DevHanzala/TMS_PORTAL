import express from "express";
import { uploadFile, listFiles, getFile, deleteFile } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", uploadFile);
router.get("/", listFiles);
router.get("/:id", getFile);
router.delete("/:id", deleteFile);

export default router;
