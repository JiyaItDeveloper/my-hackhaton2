export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-indigo-600 mb-4">404</h2>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h3>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
