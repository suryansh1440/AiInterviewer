import React, { useEffect } from 'react';
import {Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import { useInterviewStore } from '../store/useInterviewStore';




const Dashboard = () => {
  const {getInterviews} = useInterviewStore();


  useEffect(()=>{
    getInterviews()
  },[])

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