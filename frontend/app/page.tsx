'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/session';
import Link from 'next/link';
import { Sparkles, User, CheckCircle, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useSession();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/todo');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <CheckCircle size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Todo App
            </h1>
            <p className="text-gray-400 text-lg">
              Organize your tasks and boost productivity
            </p>
          </div>

          {/* Features */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm">
              <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-green-300" />
              </div>
              <span className="text-gray-300">Manage your tasks efficiently</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                <Shield size={16} className="text-blue-300" />
              </div>
              <span className="text-gray-300">Secure authentication</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 backdrop-blur-sm">
              <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-purple-300" />
              </div>
              <span className="text-gray-300">Beautiful UI/UX</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/signin"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 hover:translate-y-[-2px] flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              href="/signup"
              className="w-full bg-white/10 hover:bg-white/20 text-white py-4 px-4 rounded-xl font-semibold shadow-md border border-white/20 transform transition-all duration-300 hover:scale-105 active:scale-95 hover:translate-y-[-2px] flex items-center justify-center gap-2 group backdrop-blur-sm"
            >
              Sign Up
              <User size={16} className="group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Join thousands of users managing their tasks effectively
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