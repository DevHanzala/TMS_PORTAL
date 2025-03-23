import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: false,
  error: null,

  login: async (stakeholder, credentials) => {
    console.log('Login function called with:', { stakeholder, credentials });
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        stakeholder,
        ...credentials,
      });
      console.log('API response:', response.data);

      const userData =
        stakeholder === 'employee'
          ? {
              ...response.data.user,
              id: response.data.user.id,
              employee_id: response.data.user.employee_id,
              registration_date: response.data.user.registration_date,
              joining_date: response.data.user.joining_date,
              post_applied_for: response.data.user.post_applied_for,
              full_name: response.data.user.full_name,
              gender: response.data.user.gender,
              cnic: response.data.user.cnic,
              dob: response.data.user.dob,
              permanent_address: response.data.user.permanent_address,
              contact_number: response.data.user.contact_number,
              email: response.data.user.email,
              degree: response.data.user.degree,
              institute: response.data.user.institute,
              grade: response.data.user.grade,
              year: response.data.user.year,
              teaching_subjects: response.data.user.teaching_subjects,
              teaching_institute: response.data.user.teaching_institute,
              teaching_contact: response.data.user.teaching_contact,
              position: response.data.user.position,
              organization: response.data.user.organization,
              skills: response.data.user.skills,
              description: response.data.user.description,
              in_time: response.data.user.in_time,
              out_time: response.data.user.out_time,
              Salary_Cap: response.data.user.Salary_Cap,
              role: response.data.user.role,
              image: response.data.user.image,
              guardian_phone: response.data.user.guardian_phone,
              reference_name: response.data.user.reference_name,
              reference_contact: response.data.user.reference_contact,
              has_disease: response.data.user.has_disease,
              disease_description: response.data.user.disease_description,
            }
          : stakeholder === 'hr'
          ? { role: 'hr', email: credentials.email }
          : { role: 'superadmin' }; // Super Admin

      set({
        user: userData,
        role: response.data.user.role,
        loading: false,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  logout: () => set({ user: null, role: null, error: null }),
}));