import useAuthStore from "../store/authstore";

const Nav = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white text-white shadow-md font-poppins border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-1 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <img src="/logo-bg.png" alt="vfh Logo" className="w-16" />
          {user?.role && (
            <span className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-full text-xs px-2 py-1 text-center me-2 mb-2">
              {user.role}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          {/* Role badge */}
          

          {/* Email */}
          {user?.email && (
            <span className="text-sm text-brand-blue truncate max-w-[150px] sm:max-w-xs font-medium">
              {user.email}
            </span>
          )}

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
          {/* Optional: Add a logout icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
              Logout
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;