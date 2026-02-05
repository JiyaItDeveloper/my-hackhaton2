'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/lib/session';
import { loginUser } from '@/lib/api';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Shield, Lock as LockIcon, CheckCircle2 } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      // Assuming the response contains user data and token
      if (response.access_token && response.user) {
        login(response.user, response.access_token);
        router.push('/');
      } else {
        setError('Invalid login response');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 mb-4">
              Sign in to your account to continue
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <ShieldCheck size={14} className="mr-1" />
              Secure & Encrypted
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 transition-all duration-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:bg-white hover:border-indigo-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:bg-white hover:border-indigo-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="sr-only" />
                  <div className="relative">
                    <div className="w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded-md flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-100 group-hover:border-indigo-400">
                      <svg className="w-2.5 h-2.5 text-white scale-0 transition-transform duration-300 group-active:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 transition-colors duration-300 group-hover:text-indigo-600">Remember me</span>
                </label>

                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Security Level:</span>
                <span className="text-green-600 font-medium">High</span>
              </div>
              <div className="flex justify-between">
                <span>Last Login:</span>
                <span className="text-gray-700">Just now</span>
              </div>
              <div className="flex justify-between">
                <span>Session Timeout:</span>
                <span className="text-gray-700">30 min</span>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300 hover:underline">
                Sign up
              </Link>
            </p>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-indigo-500 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-indigo-500 hover:underline">Privacy Policy</Link>
              </p>
              <div className="flex justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <ShieldCheck size={14} className="mr-1 text-green-500" />
                  SSL Secured
                </span>
                <span className="flex items-center">
                  <Shield size={14} className="mr-1 text-blue-500" />
                  2FA Enabled
                </span>
                <span className="flex items-center">
                  <LockIcon size={14} className="mr-1 text-purple-500" />
                  Protected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
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