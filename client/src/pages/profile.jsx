import React, { useEffect, useState } from "react";
import { UserRound, Award, BarChart2, BellDot, TrendingUp, FileText } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { formatDate } from "../lib/utils";
import ChangePasswordModal from "../components/ChangePasswordModal";
import UpdateProfileModal from "../components/UpdateProfileModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../store/useInterviewStore";


const activity = [
  { icon: <BarChart2 className="w-5 h-5 text-primary" />, text: "Completed Full Stack Interview", date: "2024-07-08" },
  { icon: <Award className="w-5 h-5 text-yellow-500" />, text: "Achieved 90% in Frontend Interview", date: "2024-07-05" },
  { icon: <UserRound className="w-5 h-5 text-blue-500" />, text: "Profile Updated", date: "2024-07-01" },
];

const Profile = () => {
  const {user} = useAuthStore();
  const { interviews, setShowInterview } = useInterviewStore();
  const [showChangePass, setShowChangePass] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const navigate = useNavigate();

  // Extract stats from user
  const stats = [
    {
      label: "Total Interviews",
      value: user?.stats?.totalInterviews ?? "-",
      icon: <BarChart2 className="w-6 h-6 text-primary" />,
    },
    {
      label: "Average Score",
      value: user?.stats?.averageScore ?? "-",
      icon: <Award className="w-6 h-6 text-primary" />,
    },
    {
      label: "Level",
      value: user?.stats?.level ?? user?.level ?? "-",
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
    },
  ];

  // Show only the 3 most recent interviews (sorted by date desc)
  const recentInterviews = [...interviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-6xl px-4 relative">
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 mt-2">
          <img
            src={user?.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-primary shadow-md object-cover mb-3 md:mb-0"
          />
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-primary mb-1">{user?.name}</h2>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-base font-semibold flex items-center gap-1">
                <TrendingUp className="w-5 h-5" /> {user?.stats?.level ?? user?.level ?? "-"}
              </span>
              <span className="bg-base-200 text-primary px-3 py-1 rounded-full text-base font-semibold">Last login: {formatDate(user?.lastLogin)}</span>
            </div>
            {/* LeetCode Linked Status */}
            <div className="flex items-center gap-2 mb-2">
              {user?.leetcodeUsername ? (
                <span className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full font-semibold text-sm">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  LeetCode Linked
                  <span className="text-success/70">({user.leetcodeUsername})</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 bg-error/10 text-error px-3 py-1 rounded-full font-semibold text-sm">
                  <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  LeetCode Not Linked
                </span>
              )}
              <button className="btn btn-outline btn-primary btn-xs ml-2" onClick={() => setShowUpdateProfile(true)}>
                {user?.leetcodeUsername ? 'Update' : 'Link'}
              </button>
            </div>
            <p className="text-base-content/70 text-base mb-1">{user?.email}</p>
            <p className="text-base-content/70 text-base mb-3">{user?.phone}</p>
            <div className="flex gap-3 w-full justify-center md:justify-start mb-3">
              {user?.resume && user.resume.endsWith('.pdf') && (
                <a
                  href={user.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-primary flex items-center gap-2 font-bold shadow-sm hover:bg-primary hover:text-primary-content transition px-6 py-2 text-base"
                  style={{ minWidth: 160 }}
                >
                  <FileText className="w-5 h-5" />
                  <span>View Resume</span>
                </a>
              )}
              <button className="btn btn-outline btn-primary flex items-center gap-2 font-bold shadow-sm hover:bg-primary hover:text-primary-content transition px-6 py-2 text-base" onClick={() => setShowUpdateProfile(true)}>Update Profile</button>
            </div>
          </div>
          {/* Stats */}
          <div className="flex flex-col gap-2 items-center md:items-end">
            <div className="flex gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-1">{stat.icon}<span className="text-lg font-bold text-primary">{stat.value}</span></div>
                  <div className="text-sm text-base-content/60 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Profile Level Progress Bar */}
            <div className="w-40 mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-primary">Level Progress</span>
                <span className="text-sm font-medium text-primary">{user?.stats?.levelProgress ?? user?.levelProgress ?? 0}%</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: `${user?.stats?.levelProgress ?? user?.levelProgress ?? 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        {/* Motivational Quote / Tip */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl p-6 mb-10">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-lg font-semibold mb-1">Tip of the Day</h3>
            <p className="text-primary-content/90 text-base">Practice makes perfect! Take a mock interview every week to keep your skills sharp and boost your confidence.</p>
          </div>
        </div>
        {/* Recent Activity & Interview History */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Recent Activity */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-3">Recent Activity</h3>
            <ul className="flex flex-col gap-3">
              {activity.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span className="text-base-content font-semibold text-base">{item.text}</span>
                  <span className="ml-auto text-sm text-base-content/50">{item.date}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Interview History */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary mb-3">Recent Interviews</h3>
            <div className="overflow-x-auto">
              {recentInterviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-20 h-20 text-base-content/30 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-2xl font-bold text-base-content mb-2">No Recent Interviews</div>
                  <div className="text-base-content/70 mb-4">You haven't completed any interviews yet. Start your first interview to see it here!</div>
                  <button
                    className="btn btn-primary px-6 py-2 text-base font-bold"
                    onClick={() => navigate('/start')}
                  >
                    Take an Interview
                  </button>
                </div>
              ) : (
                <table className="min-w-full rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="py-3 px-4 text-left text-base font-bold text-primary">Date</th>
                      <th className="py-3 px-4 text-left text-base font-bold text-primary">Topic</th>
                      <th className="py-3 px-4 text-left text-base font-bold text-primary">Score</th>
                      <th className="py-3 px-4 text-left text-base font-bold text-primary">Status</th>
                      <th className="py-3 px-4 text-left text-base font-bold text-primary">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInterviews.map((row, i) => (
                      <tr key={row._id || i} className="border-t hover:bg-base-100 transition">
                        <td className="py-3 px-4 text-base">{formatDate(row.createdAt)}</td>
                        <td className="py-3 px-4 text-base font-semibold text-primary">{row.topic}</td>
                        <td className="py-3 px-4 text-base">
                          {row.feedback?.totalScore !== undefined ? (
                            <span className="badge badge-info px-3 py-1 font-bold">{row.feedback.totalScore}</span>
                          ) : (
                            <span className="text-base-content/50">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-base">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${row.status === 'completed' ? 'bg-success/20 text-success' : 'bg-base-300 text-base-content/60'}`}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>
                        </td>
                        <td className="py-3 px-4 text-base">
                          <button
                            className="bg-primary text-primary-content px-4 py-2 rounded hover:bg-primary-focus transition text-sm font-bold"
                            onClick={() => {
                              setShowInterview(row._id);
                              navigate("/dashboard/attempt");
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-end mt-6">
          <button className="bg-base-200 text-base-content px-6 py-2 rounded hover:bg-base-300 transition font-bold text-base" onClick={() => setShowUpdateProfile(true)}>Update Profile</button>
          {user?.authProvider === 'local' && (
            <button className="bg-base-200 text-base-content px-6 py-2 rounded hover:bg-base-300 transition font-bold text-base" onClick={() => setShowChangePass(true)}>Change Password</button>
          )}
          <button className="bg-error text-error-content px-6 py-2 rounded hover:bg-error/80 transition font-bold text-base" onClick={() => setShowDeleteAccount(true)}>Delete Account</button>
        </div>
      </div>
      <ChangePasswordModal open={showChangePass} onClose={() => setShowChangePass(false)} />
      <UpdateProfileModal open={showUpdateProfile} onClose={() => setShowUpdateProfile(false)} />
      <DeleteAccountModal open={showDeleteAccount} onClose={() => setShowDeleteAccount(false)} onDelete={() => setShowDeleteAccount(false)} />
      <div className="h-16" />
    </div>
  );
};

export default Profile; 