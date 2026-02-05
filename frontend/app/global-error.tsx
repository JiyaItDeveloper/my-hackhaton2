'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => reset()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}