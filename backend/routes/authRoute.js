import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

// Route for handling login
router.post('/login', authController.login);

export default router;