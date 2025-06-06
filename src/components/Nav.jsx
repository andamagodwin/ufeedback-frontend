import useAuthStore from "../store/authstore";

const Nav = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white text-white shadow-md font-poppins">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <img src="/logo.jpg" alt="vfh Logo" className="w-14" />
          <span className="text-xl font-bold tracking-tight text-brand-green">Value Family Hospital</span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          {/* Role badge */}
          {user?.role && (
            <span className="bg-brand-green text-white px-2 py-1 text-xs rounded-md uppercase tracking-wide shadow">
              {user.role}
            </span>
          )}

          {/* Email */}
          {user?.email && (
            <span className="text-sm text-brand-blue truncate max-w-[150px] sm:max-w-xs font-medium">
              {user.email}
            </span>
          )}

          {/* Logout button */}
          <button
            onClick={logout}
            className="bg-white text-brand-blue font-semibold px-2 py-1.5 rounded-full hover:bg-brand-green hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;