import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, History, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user,logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="hidden p-4 sm:flex flex-col w-64 bg-base-200 border-r">
      {/* Sidebar content */}
      <div className="flex flex-col flex-grow">
        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow">

          {/* Profile page  */}
          <Link
            to="/dashboard/profile"
            className={`btn justify-start text-base-content text-lg font-medium rounded-lg transition-colors duration-200 border-0 ${
              location.pathname === "/dashboard/profile"
                ? 'bg-primary text-primary-content shadow-md hover:bg-primary-focus'
                : 'btn-ghost hover:bg-base-300/70'
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </Link>

          {/* Admin Panel page - only for ADMIN */}
          {user?.role === 'ADMIN' && (
            <Link
              to="/dashboard/adminPanel"
              className={`btn justify-start text-base-content text-lg font-medium rounded-lg transition-colors duration-200 border-0 ${
                location.pathname === "/dashboard/adminPanel"
                  ? 'bg-primary text-primary-content shadow-md hover:bg-primary-focus'
                  : 'btn-ghost hover:bg-base-300/70'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Admin Panel
            </Link>
          )}

          {/* Attempts page  */}
          <Link
            to="/dashboard/attempt"
            className={`btn justify-start text-base-content text-lg font-medium rounded-lg transition-colors duration-200 border-0 ${
              location.pathname === "/dashboard/attempt"
                ? 'bg-primary text-primary-content shadow-md hover:bg-primary-focus'
                : 'btn-ghost hover:bg-base-300/70'
            }`}
          >
            <History className="w-5 h-5 mr-3" />
            Attempts
          </Link>

        </nav>
      </div>
      {/* Logout at bottom */}
      <div className="mt-auto">
        <button onClick={()=>{logout(); navigate("/")}} className="btn btn-error btn-outline w-full flex items-center justify-center rounded-lg text-lg font-medium">
          <LogOut className="w-5 h-5 mr-3" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
