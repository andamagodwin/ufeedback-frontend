import React from 'react';
import { NavLink } from 'react-router';
import useAuthStore from '../store/authstore';

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);

  const links = [
    { label: 'Dashboard', to: '/', roles: ['admin', 'receptionist'] },
    { label: 'Feedbacks', to: '/feedback', roles: ['admin', 'receptionist'] },
    { label: 'Add', to: '/add', roles: ['receptionist'] },
    { label: 'Analytics', to: '/analytics', roles: ['admin'] },
    { label: 'Users', to: '/users', roles: ['admin'] },
    { label: 'Settings', to: '/settings', roles: ['admin'] },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-md px-4 py-6">

      <nav className="space-y-2">
        {links
          .filter((link) => link.roles.includes(user?.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;
