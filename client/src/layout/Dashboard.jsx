import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const Dashboard = () => {
  return (
    <div className="min-h-[90vh] flex bg-base-100">
      <DashboardSidebar />
      <main className="border-2 border-amber-500 flex-1 p-3 max-h-[90vh] overflow-y-auto">
        <Outlet/>
      </main>
    </div>
  );
};

export default Dashboard; 