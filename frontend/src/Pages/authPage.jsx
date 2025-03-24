import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../Store/authStore';
import { useNavigate } from 'react-router-dom';
import { authSchema } from '../Scheema/authScheema';
import { User, Mail, Lock, IdCard, Loader2 } from 'lucide-react'; // Lucide icons
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/TMS-LOGO.webp';

// Popup Message Component
const PopupMessage = ({ message, type, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

const HrManagementModal = ({ isOpen, onClose, onSubmit, hrList, onDelete }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { hrEmail: '', hrPassword: '' },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-5 rounded-lg shadow-lg w-full max-w-sm"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Manage HR</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <Lock size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Mail size={16} className="text-orange-500" /> HR Email
                </label>
                <input
                  type="email"
                  {...register('hrEmail', { required: 'Required' })}
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="HR Email"
                />
                {errors.hrEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.hrEmail.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Lock size={16} className="text-orange-500" /> HR Password
                </label>
                <input
                  type="password"
                  {...register('hrPassword', { required: 'Required' })}
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="HR Password"
                />
                {errors.hrPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.hrPassword.message}</p>
                )}
              </div>
              <motion.button
                type="submit"
                className="w-full py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Create HR
              </motion.button>
            </form>

            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700">Current HR</h4>
              {hrList.length === 0 ? (
                <p className="text-gray-500 text-sm mt-1">No HR created yet.</p>
              ) : (
                <ul className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                  {hrList.map((hr, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span>{hr.email}</span>
                      <button
                        onClick={() => onDelete(hr.email)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AuthPage = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [isHrModalOpen, setIsHrModalOpen] = useState(false);
  const [hrList, setHrList] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      stakeholder: 'employee',
      email: '',
      cnic: '',
      password: '',
    },
  });

  const stakeholder = watch('stakeholder');

  useEffect(() => {
    if (isHrModalOpen) {
      fetch('http://localhost:5000/api/auth/hr-list')
        .then(response => response.json())
        .then(data => setHrList(data.hrList))
        .catch(error => {
          console.error('Error fetching HR list:', error);
          setPopupMessage({ text: 'Error fetching HR list', type: 'error' });
        });
    }
  }, [isHrModalOpen]);

  const showPopup = (text, type = 'success') => {
    setPopupMessage({ text, type });
    setTimeout(() => setPopupMessage(null), 3000); // Auto-dismiss after 3 seconds
  };

  const onSubmit = async (data) => {
    const credentials =
      data.stakeholder === 'employee'
        ? { email: data.email, cnic: data.cnic }
        : data.stakeholder === 'hr'
        ? { email: data.email, password: data.password }
        : { password: data.password };

    const success = await login(data.stakeholder, credentials);
    if (success) {
      showPopup(`Logged in as ${data.stakeholder} successfully`);
      if (data.stakeholder === 'employee') {
        navigate('/users');
      } else if (data.stakeholder === 'hr') {
        navigate('/uploadfile');
      } else if (data.stakeholder === 'superadmin') {
        navigate('/users');
      }
    } else {
      showPopup(error || 'Login failed', 'error');
    }
  };

  const handleCreateHrClick = () => {
    const password = prompt('Enter Super Admin Password:');
    if (password === 'tmsportal123') {
      setIsHrModalOpen(true);
    } else {
      showPopup('Invalid Super Admin Password', 'error');
    }
  };

  const handleHrSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/create-hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.hrEmail, password: data.hrPassword }),
      });
      if (response.ok) {
        showPopup('HR/Employer created successfully');
        const updatedList = await fetch('http://localhost:5000/api/auth/hr-list').then(res => res.json());
        setHrList(updatedList.hrList);
      } else {
        showPopup('Failed to create HR/Employer', 'error');
      }
    } catch (error) {
      console.error('Error creating HR:', error);
      showPopup('Error creating HR/Employer', 'error');
    }
  };

  const handleHrDelete = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/delete-hr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        showPopup('HR/Employer deleted successfully');
        const updatedList = await fetch('http://localhost:5000/api/auth/hr-list').then(res => res.json());
        setHrList(updatedList.hrList);
      } else {
        showPopup('Failed to delete HR/Employer', 'error');
      }
    } catch (error) {
      console.error('Error deleting HR:', error);
      showPopup('Error deleting HR/Employer', 'error');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut', delay: 0.1 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 overflow-auto">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="Techmire Solutions Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-xl font-semibold text-gray-800">Techmire Solutions</h1>
          <p className="text-xs text-gray-500">TMS Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
              <User size={16} className="text-orange-500" /> Role
            </label>
            <select
              {...register('stakeholder')}
              className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="superadmin">Super Admin</option>
            </select>
            {errors.stakeholder && (
              <p className="text-red-500 text-xs mt-1">{errors.stakeholder.message}</p>
            )}
          </motion.div>

          {stakeholder === 'employee' ? (
            <>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Mail size={16} className="text-orange-500" /> Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <IdCard size={16} className="text-orange-500" /> CNIC
                </label>
                <input
                  type="text"
                  {...register('cnic')}
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="Your CNIC"
                />
                {errors.cnic && (
                  <p className="text-red-500 text-xs mt-1">{errors.cnic.message}</p>
                )}
              </motion.div>
            </>
          ) : stakeholder === 'hr' ? (
            <>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Mail size={16} className="text-orange-500" /> HR Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="HR Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants}>
                <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Lock size={16} className="text-orange-500" /> Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="HR Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </motion.div>
            </>
          ) : (
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                <Lock size={16} className="text-orange-500" /> Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full p-2 mt-1 border rounded-md text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                placeholder="Super Admin Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 disabled:bg-orange-300 flex items-center justify-center gap-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Logging in
              </>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <motion.button
          onClick={handleCreateHrClick}
          className="mt-4 w-full py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ duration: 0.2 }}
        >
          Create HR
        </motion.button>
      </motion.div>

      <HrManagementModal
        isOpen={isHrModalOpen}
        onClose={() => setIsHrModalOpen(false)}
        onSubmit={handleHrSubmit}
        hrList={hrList}
        onDelete={handleHrDelete}
      />

      <PopupMessage
        message={popupMessage?.text}
        type={popupMessage?.type}
        onClose={() => setPopupMessage(null)}
      />
    </div>
  );
};

export default AuthPage;