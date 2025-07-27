import React, { useMemo, useEffect } from 'react';
import { useUsersStore } from '../store/useUsersStore';
import { Sparkles, TrendingUp, Trophy, Ban, Star, Crown, Users, UserCheck, UserPlus, Loader } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Legend
} from 'recharts';

const levelMap = {
  1: { label: 'Beginner', icon: <Sparkles className="w-4 h-4 text-info inline mr-1" /> },
  2: { label: 'Intermediate', icon: <TrendingUp className="w-4 h-4 text-warning inline mr-1" /> },
  3: { label: 'Advanced', icon: <Trophy className="w-4 h-4 text-success inline mr-1" /> },
};
const subMap = {
  none: { label: 'None', icon: <Ban className="w-4 h-4 text-base-content/40 inline mr-1" /> },
  starter: { label: 'Starter', icon: <Star className="w-4 h-4 text-white inline mr-1" /> },
  pro: { label: 'Pro', icon: <Crown className="w-4 h-4 text-yellow-600 inline mr-1" /> },
};
const SUB_COLORS = ['#d1d5db', '#3b82f6', '#facc15'];
const LEVEL_COLORS = ['#38bdf8', '#fbbf24', '#22c55e'];

const AdminPanel = () => {
  const { AllUsers, getAllUsers, isGettingAllUsers, deleteUser } = useUsersStore();
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  // 1. User Growth Over Time (by join date)
  const userGrowthData = useMemo(() => {
    const counts = {};
    AllUsers.forEach(u => {
      const date = u.createdAt.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    // Sort by date
    const sorted = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
    let cumulative = 0;
    return sorted.map(([date, count]) => {
      cumulative += count;
      return { date, users: cumulative };
    });
  }, [AllUsers]);

  // 2. Subscription Distribution
  const subDist = useMemo(() => {
    const result = [
      { name: 'None', value: AllUsers.filter(u => u.subscription === 'none').length },
      { name: 'Starter', value: AllUsers.filter(u => u.subscription === 'starter').length },
      { name: 'Pro', value: AllUsers.filter(u => u.subscription === 'pro').length },
    ];
    return result;
  }, [AllUsers]);

  // 3. Level Distribution
  const levelDist = useMemo(() => {
    return [
      { name: 'Beginner', value: AllUsers.filter(u => u.stats.level === 1).length },
      { name: 'Intermediate', value: AllUsers.filter(u => u.stats.level === 2).length },
      { name: 'Advanced', value: AllUsers.filter(u => u.stats.level === 3).length },
    ];
  }, [AllUsers]);

  const totalUsers = AllUsers.length;
  const proUsers = AllUsers.filter(u => u.subscription === 'pro').length;
  const todayLoginUsers = AllUsers.filter(u => u.createdAt.slice(0, 10) === today).length;


  if(isGettingAllUsers) return (
    <div className='flex items-center justify-center h-screen'>
    <Loader className='size-10 animate-spin' />

  </div>
  )

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Growth Over Time */}
        <div className="bg-base-200 rounded-box p-4 flex flex-col items-center shadow">
          <span className="font-semibold mb-2">User Growth Over Time</span>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={userGrowthData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" fontSize={10} tick={{ fill: '#888' }} />
              <YAxis fontSize={10} tick={{ fill: '#888' }} allowDecimals={false} width={30} />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Subscription Distribution */}
        <div className="bg-base-200 rounded-box p-4 flex flex-col items-center shadow">
          <span className="font-semibold mb-2">Subscription Distribution</span>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={subDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {subDist.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={SUB_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Level Distribution */}
        <div className="bg-base-200 rounded-box p-4 flex flex-col items-center shadow">
          <span className="font-semibold mb-2">Level Distribution</span>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={levelDist} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={10} tick={{ fill: '#888' }} />
              <YAxis fontSize={10} tick={{ fill: '#888' }} allowDecimals={false} width={30} />
              <Tooltip />
              <Bar dataKey="value">
                {levelDist.map((entry, idx) => (
                  <Cell key={`cell-bar-${idx}`} fill={LEVEL_COLORS[idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-box flex flex-row items-center gap-4">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{totalUsers}</div>
          </div>
        </div>
        <div className="stat bg-base-200 rounded-box flex flex-row items-center gap-4">
          <UserCheck className="w-8 h-8 text-secondary" />
          <div>
            <div className="stat-title">Pro Users</div>
            <div className="stat-value text-secondary">{proUsers}</div>
          </div>
        </div>
        <div className="stat bg-base-200 rounded-box flex flex-row items-center gap-4">
          <UserPlus className="w-8 h-8 text-accent" />
          <div>
            <div className="stat-title">Today Login Users</div>
            <div className="stat-value text-accent">{todayLoginUsers}</div>
          </div>
        </div>
      </div>
      {/* User Table */}
      <div className="overflow-x-auto overflow-y-auto rounded-box shadow h-[400px]">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Level</th>
              <th>Subscription</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {AllUsers.map(user => (
              <tr key={user._id} className="hover">
                <td>
                  <img src={user.profilePic|| "/avatar.png"} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-base-300" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-outline flex items-center gap-1">
                    {levelMap[user.stats?.level ?? user.level]?.icon}
                    {levelMap[user.stats?.level ?? user.level]?.label || user.stats?.level || user.level}
                  </span>
                </td>
                <td>
                  {user.subscription === 'starter' && (
                    <span className="badge badge-info flex items-center gap-1 text-white bg-blue-500 border-blue-500">
                      {subMap.starter.icon}
                      {subMap.starter.label}
                    </span>
                  )}
                  {user.subscription === 'pro' && (
                    <span className="badge badge-warning flex items-center gap-1 text-yellow-900 bg-yellow-300 border-yellow-400 shadow ring-2 ring-yellow-400/60">
                      {subMap.pro.icon}
                      {subMap.pro.label}
                    </span>
                  )}
                  {user.subscription === 'none' && (
                    <span className="badge badge-ghost flex items-center gap-1">
                      {subMap.none.icon}
                      {subMap.none.label}
                    </span>
                  )}
                </td>
                <td>{user.createdAt.slice(0, 10)}</td>
                <td>
                  <button className="btn btn-xs btn-error" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
