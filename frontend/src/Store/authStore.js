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
      set({
        user: response.data.user,
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