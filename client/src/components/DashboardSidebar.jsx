import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LayoutDashboard, History, LogOut } from 'lucide-react';

const navLinks = [
  {
    to: '/dashboard/profile',
    icon: <User className="w-5 h-5 mr-3" />,
    label: 'Profile',
  },
  {
    to: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5 mr-3" />,
    label: 'Admin Panel',
  },
  {
    to: '/dashboard/attempt',
    icon: <History className="w-5 h-5 mr-3" />,
    label: 'Attempts',
  },
];

const DashboardSidebar = () => {
  const location = useLocation();
  return (
    <aside className="max-h-[90vh] w-64 bg-base-200 flex flex-col py-6 px-4 border-r border-base-300">
      <div className="flex flex-col flex-grow">
        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`btn justify-start text-base-content text-lg font-medium rounded-lg transition-colors duration-200 border-0 ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-md hover:bg-primary-focus'
                    : 'btn-ghost hover:bg-base-300/70'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Logout at bottom */}
      <div className="mt-auto">
        <button className="btn btn-error btn-outline w-full flex items-center justify-center rounded-lg text-lg font-medium">
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
