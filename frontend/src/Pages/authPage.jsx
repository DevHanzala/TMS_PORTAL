import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../Store/authStore';
import { useNavigate } from 'react-router-dom';
import { authSchema } from '../Scheema/authScheema';

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
      cnic: '', // Changed cnic_no to cnic
      password: '',
    },
  });

  const stakeholder = watch('stakeholder');

  const onSubmit = async (data) => {
    console.log('Form submission triggered with data:', data);
    const credentials =
      data.stakeholder === 'employee'
        ? { email: data.email, cnic: data.cnic } // Changed cnic_no to cnic
        : { password: data.password };

    console.log('Calling login with:', { stakeholder: data.stakeholder, credentials });
    const success = await login(data.stakeholder, credentials);
    console.log('Login result:', success);
    if (success) {
      console.log('Navigating to:', data.stakeholder === 'employee' ? '/employee-dashboard' : '/hr-dashboard');
      navigate(data.stakeholder === 'employee' ? '/users' : '/uploadfile');
    } else {
      console.log('Login failed, no navigation');
    }
  };

  console.log('Form errors:', errors);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to TMS Portal</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              {...register('stakeholder')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR/Employer</option>
            </select>
            {errors.stakeholder && (
              <p className="text-red-500 text-sm mt-1">{errors.stakeholder.message}</p>
            )}
          </div>

          {stakeholder === 'employee' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC
                </label>
                <input
                  type="text"
                  {...register('cnic')} // Changed cnic_no to cnic
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your CNIC"
                />
                {errors.cnic && ( // Changed cnic_no to cnic
                  <p className="text-red-500 text-sm mt-1">{errors.cnic.message}</p>
                )}
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter HR password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;