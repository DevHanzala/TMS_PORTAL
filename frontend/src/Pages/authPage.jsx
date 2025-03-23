import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../Store/authStore';
import { useNavigate } from 'react-router-dom';
import { authSchema } from '../Scheema/authScheema';
import { FaUser, FaEnvelope, FaLock, FaIdCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../assets/TMS-LOGO.webp'; // Company logo

const AuthPage = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    console.log('Form submission triggered with data:', data);
    const credentials =
      data.stakeholder === 'employee'
        ? { email: data.email, cnic: data.cnic }
        : { password: data.password };

    console.log('Calling login with:', { stakeholder: data.stakeholder, credentials });
    const success = await login(data.stakeholder, credentials);
    console.log('Login result:', success);
    if (success) {
      console.log('Navigating to:', data.stakeholder === 'employee' ? '/users' : '/uploadfile');
      navigate(data.stakeholder === 'employee' ? '/users' : '/uploadfile');
    } else {
      console.log('Login failed, no navigation');
    }
  };

  console.log('Form errors:', errors);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  // Define the background image URL directly
  const authBgUrl = 'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGNvcnBvcmF0ZXxlbnwwfHwwfHx8MA%3D%3D';

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center overflow-auto" // Changed min-h-screen to h-screen and added overflow-auto
      style={{ backgroundImage: `url(${authBgUrl})` }}
    >
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md bg-opacity-90"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Company Logo and Name */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Techmire Solutions Logo" className="w-24 h-24 mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">Techmire Solutions</h1>
          <p className="text-sm text-gray-500">Login to TMS Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Stakeholder Selection */}
          <motion.div variants={inputVariants} initial="hidden" animate="visible">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaUser className="mr-2 text-orange-500" /> Select Role
            </label>
            <select
              {...register('stakeholder')}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR/Employer</option>
            </select>
            {errors.stakeholder && (
              <p className="text-red-500 text-sm mt-1">{errors.stakeholder.message}</p>
            )}
          </motion.div>

          {/* Employee Fields */}
          {stakeholder === 'employee' ? (
            <>
              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaEnvelope className="mr-2 text-orange-500" /> Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </motion.div>
              <motion.div variants={inputVariants} initial="hidden" animate="visible">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaIdCard className="mr-2 text-orange-500" /> CNIC
                </label>
                <input
                  type="text"
                  {...register('cnic')}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Enter your CNIC"
                />
                {errors.cnic && (
                  <p className="text-red-500 text-sm mt-1">{errors.cnic.message}</p>
                )}
              </motion.div>
            </>
          ) : (
            /* HR Field */
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaLock className="mr-2 text-orange-500" /> Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                placeholder="Enter HR password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              className="text-red-500 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;