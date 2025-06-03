import useAuthStore from "../store/authstore";

const Nav = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <div className="text-2xl font-semibold tracking-wide">uFeedback</div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          {/* Role badge */}
          {user?.role && (
            <span className="bg-blue-600 px-2 py-1 text-xs rounded-full uppercase">
              {user.role}
            </span>
          )}

          {/* Email */}
          {user?.email && (
            <span className="text-sm text-gray-100 truncate max-w-[150px] sm:max-w-xs">
              {user.email}
            </span>
          )}

          {/* Logout button */}
          <button
            onClick={logout}
            className="bg-white text-red-800 font-medium px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
