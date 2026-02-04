import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Replace with your actual logout API call
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Handle successful logout (clear tokens, redirect, etc.)
        console.log('Logout successful');
        // Redirect to home or login page
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('An error occurred during logout:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleConfirmLogout = () => {
    setShowConfirmation(true);
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 parallax-bg">
      <Head>
        <title>Logout - Todo App</title>
        <meta name="description" content="Securely logout from your Todo account" />
      </Head>

      <div className="w-full max-w-md">
        {/* Creative Header with Enhanced Hover Effects */}
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-r from-red-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">See You Later</h1>
          <p className="text-gray-600 mt-2">Your session will be securely ended</p>
        </div>

        {!showConfirmation ? (
          /* Confirmation Card with Enhanced Hover Effects */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover-lift">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors duration-300 pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Leave?</h2>
                <p className="text-gray-600">
                  Your current session will be ended and you'll be signed out of your account.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleConfirmLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transform transition-all duration-300 hover:from-red-600 hover:to-orange-600 hover:shadow-xl hover:scale-105 active:scale-95 ripple focus-ring"
                >
                  Sign Out
                </button>

                <Link href="/dashboard" className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-300 hover:scale-105 active:scale-95 transform focus-ring">
                  Stay Signed In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Logout Processing Card with Enhanced Hover Effects */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover-lift">
            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse group-hover:bg-blue-200 transition-colors duration-300">
                  {isLoggingOut ? (
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {isLoggingOut ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Signing Out...</h2>
                    <p className="text-gray-600">
                      Securing your account and ending your session safely.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Signed Out Successfully!</h2>
                    <p className="text-gray-600">
                      Your session has been securely ended.
                    </p>
                  </>
                )}
              </div>

              {isLoggingOut ? (
                <div className="text-center">
                  <div className="inline-block animate-pulse">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link href="/" className="block w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 active:scale-95 transform ripple focus-ring">
                    Go Home
                  </Link>

                  <Link href="/login" className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors duration-300 hover:scale-105 active:scale-95 transform focus-ring">
                    Sign In Again
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info Section with Enhanced Hover Effects */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50 hover-scale">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">Secure</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50 hover-scale">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600">Fast</p>
          </div>
        </div>

        {/* Back to Dashboard Link with Enhanced Hover Effects */}
        <div className="mt-6 text-center">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300 hover:underline focus-ring">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}