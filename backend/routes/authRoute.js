import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/profile/:id', authController.getUserProfile);
router.post('/create-hr', authController.createHr);
router.post('/delete-hr', authController.deleteHr);
router.get('/hr-list', authController.getHrList); // New route to fetch HR list

export default router;