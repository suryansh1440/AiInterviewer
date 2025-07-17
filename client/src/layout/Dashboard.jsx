import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuthStore } from '../store/useAuthStore';


const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] flex bg-base-100 scrollbar-hide">
      <DashboardSidebar />
      <main className="flex-1 p-3 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <Outlet/>
      </main>
    </div>
  );
};

export default Dashboard; 