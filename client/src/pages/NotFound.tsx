
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the path starts with /admin to show appropriate navigation
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          {isAdminPath ? (
            <>
              <Link 
                to="/admin" 
                className="block w-full px-4 py-2 bg-moroccan-blue text-white rounded hover:bg-moroccan-blue/90 transition"
              >
                Return to Admin Dashboard
              </Link>
              <Link 
                to="/" 
                className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                Go to Homepage
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className="block w-full px-4 py-2 bg-moroccan-blue text-white rounded hover:bg-moroccan-blue/90 transition"
              >
                Return to Homepage
              </Link>
              <Link 
                to="/properties" 
                className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                Browse Properties
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
