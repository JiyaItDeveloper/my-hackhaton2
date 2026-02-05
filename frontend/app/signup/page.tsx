'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/api';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  // Check if all required fields are filled to enable submit button
  const isFormValid = formData.name.trim() !== '' &&
                     formData.email.trim() !== '' &&
                     formData.password.trim() !== '' &&
                     formData.confirmPassword.trim() !== '' &&
                     formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email address is invalid');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });

      setShowSuccessModal(true);

      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login after a short delay to show success message
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 animate-in fade-in-90 zoom-in-90 border border-white/20">
            <div className="text-center">
              <div className="mx-auto bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Account Created!</h2>
              <p className="text-gray-300 mb-6">Your account has been created successfully</p>
              <button
                onClick={closeSuccessModal}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95 hover:translate-y-[-2px]"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">
              Join us today to get started
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <User size={16} className="text-indigo-300" />
                  </div>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <Mail size={16} className="text-indigo-300" />
                  </div>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <Lock size={16} className="text-indigo-300" />
                  </div>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center hover:bg-gray-400/30 transition-colors">
                      <EyeOff size={14} className="text-gray-300" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center hover:bg-gray-400/30 transition-colors">
                      <Eye size={14} className="text-gray-300" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <Lock size={16} className="text-indigo-300" />
                  </div>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-14 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 text-white placeholder-gray-400"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center hover:bg-gray-400/30 transition-colors">
                      <EyeOff size={14} className="text-gray-300" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center hover:bg-gray-400/30 transition-colors">
                      <Eye size={14} className="text-gray-300" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105'
                  : 'bg-gray-600 cursor-not-allowed'
              } text-white py-4 px-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px]`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-300 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 blur-xl"></div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}