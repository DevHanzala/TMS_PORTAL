import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

// Route for handling login
router.post('/login', authController.login);
// Route for fetching user profile by ID
router.get('/profile/:id', authController.getUserProfile);

export default router;