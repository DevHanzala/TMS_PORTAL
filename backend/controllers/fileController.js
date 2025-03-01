import multer from "multer";
import xlsx from "xlsx";
import { Readable } from "stream";
import File from "../models/fileModel.js";

// Configure Multer for file uploads (stores in memory)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Upload an XLSX file, convert it to CSV, and store it in PostgreSQL
 */
export const uploadFile = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "File upload failed" });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      // Convert XLSX to CSV
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const csvData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);

      // Store CSV in PostgreSQL as binary
      const fileRecord = await File.create({
        filename: req.file.originalname.replace(".xlsx", ".csv"),
        filetype: "text/csv",
        filedata: Buffer.from(csvData, "utf-8"), // Store as binary
      });

      res.status(201).json({
        message: "File uploaded and converted to CSV successfully",
        file: fileRecord,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "Error processing file" });
    }
  });
};

/**
 * Retrieve all stored files
 */
export const listFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      attributes: ["id", "filename", "filetype", "createdAt"], // Exclude binary data
    });
    res.json({ files });
  } catch (error) {
    console.error("List Files Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieve a specific file's content by ID
 */
export const getFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    // Convert binary data to CSV text
    const csvText = file.filedata.toString("utf-8");

    res.status(200).json({
      filename: file.filename,
      filetype: file.filetype,
      content: csvText, // Send CSV content as JSON
    });
  } catch (error) {
    console.error("Get File Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Download a file as an attachment
 */
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("Content-Type", "text/csv");

    const readStream = new Readable();
    readStream.push(file.filedata);
    readStream.push(null);

    readStream.pipe(res);
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a file by ID
 */
export const deleteFile = async (req, res) => {
  try {
    const deletedFile = await File.destroy({ where: { id: req.params.id } });
    if (!deletedFile) return res.status(404).json({ error: "File not found" });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete File Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
