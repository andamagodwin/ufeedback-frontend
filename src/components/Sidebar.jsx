import React, { useState } from 'react';
import { NavLink } from 'react-router';
import useAuthStore from '../store/authstore';
import {
  FaTachometerAlt,
  FaCommentDots,
  FaUserPlus,
  FaChartBar,
  FaUsersCog,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

import { CgNotes } from "react-icons/cg";

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const links = [
    {
      label: 'Dashboard',
      to: '/',
      icon: <FaTachometerAlt />,
      roles: ['admin', 'receptionist'],
    },
    {
      label: 'Feedbacks',
      to: '/feedback',
      icon: <FaCommentDots />,
      roles: ['admin'],
    },
    {
      label: 'Add Patient',
      to: '/add',
      icon: <FaUserPlus />,
      roles: ['receptionist'],
    },
    {
      label: 'Analytics',
      to: '/analytics',
      icon: <FaChartBar />,
      roles: ['admin'],
    },
    {
      label: 'Reports',
      to: '/reports',
      icon: <CgNotes />,
      roles: ['admin'],
    },
    {
      label: 'Users',
      to: '/users',
      icon: <FaUsersCog />,
      roles: ['admin'],
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: <FaCog />,
      roles: ['admin'],
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4 bg-white flex justify-between items-center font-poppins">
        <button onClick={toggleSidebar} className="text-2xl text-[#233f92]">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block fixed md:relative top-0 left-0 h-screen w-64 font-poppins bg-white border-r border-gray-200 z-50`}
      >
        <div className="p-5 flex flex-col h-full">

          <nav className="flex-1 space-y-1">
            {links
              .filter((link) => link.roles.includes(user?.role))
              .map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                        : 'text-gray-700 hover:bg-[#e5f0ff]'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-sm font-medium">{link.label}</span>
                </NavLink>
              ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 mt-6 text-red-600 hover:bg-red-100 rounded-lg transition-all"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
