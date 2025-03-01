import { sequelize } from "../DB/DBconnection.js";
import { QueryTypes } from "sequelize";

// Controller for handling authentication logic
export const authController = {
  // Login function for both Employee and HR/Employer
  login: async (req, res) => {
    const { stakeholder, email, cnic, password } = req.body; // Changed cnic_no to cnic
    console.log('Received login request:', req.body);

    try {
      if (stakeholder === 'employee') {
        // Employee login: Validate email and CNIC against DB
        if (!email || !cnic) { // Changed cnic_no to cnic
          return res.status(400).json({ message: 'Email and CNIC are required for employee login' });
        }

        // Query to check if user exists with given email and CNIC
        const users = await sequelize.query(
          'SELECT * FROM users WHERE email = :email AND cnic = :cnic', // Changed cnic_no to cnic
          {
            replacements: { email, cnic }, // Changed cnic_no to cnic
            type: QueryTypes.SELECT,
          }
        );

        if (users.length === 0) {
          return res.status(401).json({ message: 'Invalid email or CNIC' });
        }

        // Employee authenticated successfully
        const user = users[0];
        return res.status(200).json({
          message: 'Employee login successful',
          user: { id: user.id, email: user.email, role: 'employee' }
        });
      } else if (stakeholder === 'hr') {
        // HR/Employer login: Check specific password
        if (!password) {
          return res.status(400).json({ message: 'Password is required for HR login' });
        }

        const hrPassword = 'tmsportal123'; // Hardcoded HR password (consider hashing in production)
        if (password !== hrPassword) {
          return res.status(401).json({ message: 'Invalid HR password' });
        }

        // HR authenticated successfully
        return res.status(200).json({
          message: 'HR login successful',
          user: { role: 'hr' }
        });
      } else {
        return res.status(400).json({ message: 'Invalid stakeholder type' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};