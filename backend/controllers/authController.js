import { sequelize } from "../DB/DBconnection.js";
import { QueryTypes } from "sequelize";
import HrUser from "../models/hrUsers.js";

export const authController = {
  login: async (req, res) => {
    const { stakeholder, email, cnic, password } = req.body;
    console.log('Received login request:', req.body);

    try {
      if (stakeholder === 'employee') {
        if (!email || !cnic) {
          return res.status(400).json({ message: 'Email and CNIC are required for employee login' });
        }

        const users = await sequelize.query(
          'SELECT * FROM users WHERE email = :email AND cnic = :cnic',
          {
            replacements: { email, cnic },
            type: QueryTypes.SELECT,
          }
        );

        if (users.length === 0) {
          return res.status(401).json({ message: 'Invalid email or CNIC' });
        }

        const user = users[0];
        console.log('Raw user data from DB:', user);

        let imageBase64 = null;
        if (user.image) {
          imageBase64 = Buffer.from(user.image).toString('base64');
        }

        return res.status(200).json({
          message: 'Employee login successful',
          user: {
            id: user.id,
            employee_id: user.employee_id,
            registration_date: user.registration_date,
            joining_date: user.joining_date,
            post_applied_for: user.post_applied_for,
            full_name: user.full_name,
            gender: user.gender,
            cnic: user.cnic,
            dob: user.dob,
            permanent_address: user.permanent_address,
            contact_number: user.contact_number,
            email: user.email,
            degree: user.degree,
            institute: user.institute,
            grade: user.grade,
            year: user.year,
            teaching_subjects: user.teaching_subjects,
            teaching_institute: user.teaching_institute,
            teaching_contact: user.teaching_contact,
            position: user.position,
            organization: user.organization,
            skills: user.skills,
            description: user.description,
            in_time: user.in_time,
            out_time: user.out_time,
            Salary_Cap: user.Salary_Cap,
            role: 'employee',
            image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
            guardian_phone: user.guardian_phone,
            reference_name: user.reference_name,
            reference_contact: user.reference_contact,
            has_disease: user.has_disease,
            disease_description: user.disease_description,
          },
        });
      } else if (stakeholder === 'hr') {
        if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required for HR login' });
        }

        const hr = await HrUser.findOne({ where: { email, password } });
        if (!hr) {
          return res.status(401).json({ message: 'Invalid HR email or password' });
        }

        return res.status(200).json({
          message: 'HR login successful',
          user: { role: 'hr', email },
        });
      } else if (stakeholder === 'superadmin') {
        if (!password) {
          return res.status(400).json({ message: 'Password is required for Super Admin login' });
        }

        const superAdminPassword = 'tmsportal123';
        if (password !== superAdminPassword) {
          return res.status(401).json({ message: 'Invalid Super Admin password' });
        }

        return res.status(200).json({
          message: 'Super Admin login successful',
          user: { role: 'superadmin' },
        });
      } else {
        return res.status(400).json({ message: 'Invalid stakeholder type' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  createHr: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const existingHr = await HrUser.findOne({ where: { email } });
      if (existingHr) {
        return res.status(400).json({ message: 'HR email already exists' });
      }

      await HrUser.create({ email, password });
      return res.status(200).json({ message: 'HR/Employer created successfully' });
    } catch (error) {
      console.error('Create HR error:', error);
      return res.status(500).json({ message: 'Failed to create HR/Employer' });
    }
  },

  deleteHr: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const hr = await HrUser.findOne({ where: { email } });
      if (!hr) {
        return res.status(404).json({ message: 'HR/Employer not found' });
      }

      await hr.destroy();
      return res.status(200).json({ message: 'HR/Employer deleted successfully' });
    } catch (error) {
      console.error('Delete HR error:', error);
      return res.status(500).json({ message: 'Failed to delete HR/Employer' });
    }
  },

  getHrList: async (req, res) => {
    try {
      const hrList = await HrUser.findAll({ attributes: ['email'] });
      return res.status(200).json({ hrList: hrList.map(hr => ({ email: hr.email })) });
    } catch (error) {
      console.error('Get HR list error:', error);
      return res.status(500).json({ message: 'Failed to fetch HR list' });
    }
  },

  getUserProfile: async (req, res) => {
    const { id } = req.params;

    try {
      const users = await sequelize.query(
        'SELECT * FROM users WHERE id = :id',
        {
          replacements: { id },
          type: QueryTypes.SELECT,
        }
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = users[0];
      console.log('Raw user data from DB (profile):', user);

      let imageBase64 = null;
      if (user.image) {
        imageBase64 = Buffer.from(user.image).toString('base64');
      }

      return res.status(200).json({
        user: {
          id: user.id,
          employee_id: user.employee_id,
          registration_date: user.registration_date,
          joining_date: user.joining_date,
          post_applied_for: user.post_applied_for,
          full_name: user.full_name,
          gender: user.gender,
          cnic: user.cnic,
          dob: user.dob,
          permanent_address: user.permanent_address,
          contact_number: user.contact_number,
          email: user.email,
          degree: user.degree,
          institute: user.institute,
          grade: user.grade,
          year: user.year,
          teaching_subjects: user.teaching_subjects,
          teaching_institute: user.teaching_institute,
          teaching_contact: user.teaching_contact,
          position: user.position,
          organization: user.organization,
          skills: user.skills,
          description: user.description,
          in_time: user.in_time,
          out_time: user.out_time,
          Salary_Cap: user.Salary_Cap,
          role: 'employee',
          image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
          guardian_phone: user.guardian_phone,
          reference_name: user.reference_name,
          reference_contact: user.reference_contact,
          has_disease: user.has_disease,
          disease_description: user.disease_description,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};