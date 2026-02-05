"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const { login } = useSession();

  // Check if both email and password are filled to enable submit button
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      // The response should contain user data and token
      // Adjust based on your actual API response structure
      if (response.access_token) {
        // Extract user data from response - assuming response contains user info
        const userData = response.user || { email, name: response.name || email.split('@')[0] };

        login(userData, response.access_token);
        setShowSuccessModal(true);

        // Redirect after a delay to show the success message
        setTimeout(() => {
          router.push("/todo"); // Redirect to todo dashboard instead of home
        }, 2000);
      } else {
        setError("Invalid login response - missing token");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
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
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Success!</h2>
              <p className="text-gray-300 mb-6">You are signed in successfully</p>
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95 hover:translate-y-[-2px]"
              >
                Continue to Dashboard
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 transition-all duration-300 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 pl-14 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 pl-14 bg-white/10 border border-white/20 rounded-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 hover:bg-white/20 hover:border-indigo-300 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/20 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="sr-only" />
                <div className="relative">
                  <div className="w-6 h-6 bg-white/20 border-2 border-white/30 rounded-md flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-500/30 group-hover:border-indigo-400">
                    <svg className="w-4 h-4 text-white scale-0 transition-transform duration-300 group-active:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-2 text-sm text-gray-400 transition-colors duration-300 group-hover:text-indigo-300">Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-300 hover:underline">
                Forgot password?
              </Link>
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-300 hover:underline">
                Sign up
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