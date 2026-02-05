'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import { Power, CheckCircle2, ShieldCheck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignOutPage() {
  const router = useRouter();
  const { logout } = useSession();

  useEffect(() => {
    const performLogout = async () => {
      await logout(); // Wait for backend logout to complete
      // Redirect after a short delay to show logout confirmation
      setTimeout(() => {
        router.push('/');
      }, 1500);
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Power size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Signing Out
            </h1>
            <p className="text-gray-300 mb-4">
              You're being securely signed out
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/30">
              <ShieldCheck size={14} className="mr-1" />
              Session Terminated Safely
            </div>
          </div>

          {/* Logout Process */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                  <Power size={24} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">OFF</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-100">Securely Signing Out</h2>
              <p className="text-gray-400">We're securely terminating your session</p>

              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 space-y-3 text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Session Data:</span>
                  <span className="text-green-400 font-medium">Cleared</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authentication:</span>
                  <span className="text-green-400 font-medium">Revoked</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Redirecting in:</span>
                  <span className="text-blue-400 font-medium">1.5s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Redirecting to sign in page...
            </p>
            <Link
              href="/signin"
              className="inline-flex items-center px-4 py-2 text-sm text-purple-300 hover:text-purple-100 transition-colors duration-300"
            >
              <ArrowLeft size={14} className="mr-1" />
              Back to Sign In
            </Link>

            <div className="border-t border-gray-700 mt-6 pt-4 space-y-3">
              <p className="text-xs text-gray-500">
                Your session has been securely terminated. All sensitive data has been cleared from your browser.
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <CheckCircle2 size={12} className="mr-1 text-green-400" />
                  Session Cleared
                </span>
                <span className="flex items-center">
                  <Shield size={12} className="mr-1 text-blue-400" />
                  Data Secure
                </span>
                <span className="flex items-center">
                  <ShieldCheck size={12} className="mr-1 text-purple-400" />
                  Safe Logout
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-10 blur-xl"></div>
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