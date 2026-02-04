import React from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Wait for backend logout to complete
    router.push('/signout');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Todo App
            </Link>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link href="/todo" className="text-gray-700 hover:text-indigo-600 mr-4 px-3 py-2 rounded-md text-sm font-medium">
                  Todo
                </Link>
                <Link href="/fancy-todo" className="text-gray-700 hover:text-indigo-600 mr-4 px-3 py-2 rounded-md text-sm font-medium">
                  Fancy Todo
                </Link>
                <span className="text-gray-700 mr-4">Welcome, {user?.name || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4 lucide-icon" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ml-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;