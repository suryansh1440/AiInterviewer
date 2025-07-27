import React, { useEffect } from 'react';
import { useUsersStore } from '../store/useUsersStore';
import { Crown, TrendingUp, Award } from 'lucide-react';

const Leaderboard = () => {
  const { AllUsers, getAllUsers, isGettingAllUsers } = useUsersStore();

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  // Sort users by level, then averageScore (numeric, missing/invalid = -Infinity), then levelProgress
  const sortedUsers = [...AllUsers].sort((a, b) => {
    const aLevel = Number(a.stats?.level ?? a.level ?? 0);
    const bLevel = Number(b.stats?.level ?? b.level ?? 0);
    if (bLevel !== aLevel) return bLevel - aLevel;

    // Convert averageScore to number, treat invalid as -Infinity
    const aScoreRaw = a.stats?.averageScore;
    const bScoreRaw = b.stats?.averageScore;
    const aScore = (aScoreRaw === null || aScoreRaw === undefined || isNaN(Number(aScoreRaw))) ? -Infinity : Number(aScoreRaw);
    const bScore = (bScoreRaw === null || bScoreRaw === undefined || isNaN(Number(bScoreRaw))) ? -Infinity : Number(bScoreRaw);
    if (bScore !== aScore) return bScore - aScore;

    const aProgress = Number(a.stats?.levelProgress ?? a.levelProgress ?? 0);
    const bProgress = Number(b.stats?.levelProgress ?? b.levelProgress ?? 0);
    return bProgress - aProgress;
  });

  // Top 3 users for card display
  const topThree = sortedUsers.slice(0, 3);

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto flex-1 bg-base-200 rounded-2xl shadow-lg overflow-y-auto scrollbar-hide max-h-[90vh] p-4 md:p-8 pb-24 md:pb-8 relative">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-6 sm:mb-8 text-center tracking-tight drop-shadow">Leaderboard</h1>
        {/* Top 3 Cards - Mobile Podium Style */}
        {/* Mobile Podium for Top 3 */}
        {topThree.length > 0 && (
          <div className="sm:hidden w-full flex items-end justify-center gap-2 mb-8 bg-[#181c2f] rounded-2xl py-6 relative">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center justify-end relative z-0" style={{marginTop: '32px'}}>
                <div className="relative">
                  <img
                    src={topThree[1].profilePic || '/avatar.png'}
                    alt={topThree[1].name}
                    className="w-16 h-16 rounded-full border-4 border-blue-400 object-cover shadow-lg"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar.png'; }}
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white">2</span>
                </div>
                <div className="mt-2 text-base font-bold text-white text-center">{topThree[1].name}</div>
                <div className="flex items-center gap-1 font-bold text-primary justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Level: {topThree[1].stats?.level ?? topThree[1].level ?? '-'}
                </div>
                <div className="text-xs text-gray-400">{topThree[1].name}</div>
              </div>
            )}
            {/* 1st Place */}
            {topThree[0] && (
              <div className="flex flex-col items-center justify-end relative z-10">
                <div className="relative">
                  <img
                    src={topThree[0].profilePic || '/avatar.png'}
                    alt={topThree[0].name}
                    className="w-20 h-20 rounded-full border-4 border-yellow-400 object-cover shadow-xl"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar.png'; }}
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white">1</span>
                </div>
                <div className="mt-2 text-lg font-bold text-white text-center">{topThree[0].name}</div>
                <div className="flex items-center gap-1 font-bold text-primary justify-center mt-1">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Level: {topThree[0].stats?.level ?? topThree[0].level ?? '-'}
                </div>
                <div className="text-xs text-gray-400">{topThree[0].name}</div>
              </div>
            )}
            {/* 3rd Place */}
            {topThree[2] && (
              <div className="flex flex-col items-center justify-end relative z-0" style={{marginTop: '48px'}}>
                <div className="relative">
                  <img
                    src={topThree[2].profilePic || '/avatar.png'}
                    alt={topThree[2].name}
                    className="w-14 h-14 rounded-full border-4 border-green-400 object-cover shadow-lg"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar.png'; }}
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white">3</span>
                </div>
                <div className="mt-2 text-base font-bold text-white text-center">{topThree[2].name}</div>
                <div className="flex items-center gap-1 font-bold text-primary justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Level: {topThree[2].stats?.level ?? topThree[2].level ?? '-'}
                </div>
                <div className="text-xs text-gray-400">{topThree[2].name}</div>
              </div>
            )}
          </div>
        )}
        {/* Top 3 Cards - Desktop/Tablets */}
        {/* Desktop/Tablets Podium */}
        {topThree.length > 0 && (
          <div className="hidden sm:flex flex-row items-center justify-center gap-6 mb-10">
            {topThree.map((user, idx) => {
              const isTop1 = idx === 0;
              const isTop2 = idx === 1;
              const isTop3 = idx === 2;
              return (
                <div
                  key={user._id}
                  className={`flex flex-col items-center justify-center bg-base-100 shadow-lg rounded-2xl px-6 py-6 min-w-[200px] max-w-[260px] border-2 ${isTop1 ? 'border-yellow-400 scale-110 z-10' : isTop2 ? 'border-gray-400' : 'border-amber-400'} relative`}
                  style={{ marginTop: isTop1 ? 0 : 24 }}
                >
                  {isTop1 && <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400 drop-shadow" />}
                  <img
                    src={user.profilePic || '/avatar.png'}
                    alt={user.name}
                    className={`w-20 h-20 rounded-full border-4 object-cover shadow ${isTop1 ? 'border-yellow-400' : isTop2 ? 'border-gray-400' : 'border-amber-400'}`}
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar.png'; }}
                  />
                  <div className="mt-3 text-xl font-bold text-base-content text-center flex items-center gap-2">
                    {user.name}
                    {isTop1 && <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase">Top</span>}
                  </div>
                  <div className="flex items-center gap-2 text-base font-semibold text-primary mb-1">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Level: {user.stats?.level ?? user.level ?? '-'}
                  </div>
                  <div className="flex items-center gap-2 text-base font-semibold text-base-content/90">
                    <Award className="w-5 h-5 text-info" />
                    Interviews: {user.stats?.totalInterviews ?? '-'}
                  </div>
                  <div className="flex items-center gap-2 text-base font-semibold text-base-content/90">
                    <span className="inline-block w-4 h-4 bg-primary rounded-full mr-1" />
                    Avg. Score: {user.stats?.averageScore ?? '-'}
                  </div>
                  <span className="absolute top-2 left-2 text-xs font-bold text-base-content/40">#{idx + 1}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* Leaderboard Table */}
        <div className="w-full overflow-x-auto rounded-2xl shadow-xl bg-base-100/95 p-0.5 sm:p-2 md:p-6 border border-base-300">
          <table className="min-w-[320px] sm:min-w-[600px] w-full table-auto rounded-xl overflow-hidden text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <th className="py-2 px-1 sm:py-3 sm:px-2 font-bold text-left">#</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 font-bold text-left">User</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 font-bold text-left">Level</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 font-bold text-left hidden sm:table-cell">Total Interviews</th>
                <th className="py-2 px-1 sm:py-3 sm:px-2 font-bold text-left hidden sm:table-cell">Avg. Score</th>
              </tr>
            </thead>
            <tbody>
              {isGettingAllUsers ? (
                <tr><td colSpan={5} className="py-10 text-center text-lg text-base-content/60">Loading...</td></tr>
              ) : sortedUsers.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-lg text-base-content/60">No users found.</td></tr>
              ) : (
                sortedUsers.map((user, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;
                  return (
                    <tr
                      key={user._id}
                      className={`transition border-b border-base-300 hover:bg-primary/10 ${isTop1 ? 'bg-yellow-50/40' : isTop2 ? 'bg-gray-50/40' : isTop3 ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="py-2 px-2 text-lg font-bold text-center align-middle">
                        {isTop1 ? <Crown className="inline w-6 h-6 text-yellow-400 drop-shadow mr-1" /> : isTop2 ? <span className="inline-block w-6 h-6 text-gray-400 font-extrabold align-middle">2</span> : isTop3 ? <span className="inline-block w-6 h-6 text-amber-500 font-extrabold align-middle">3</span> : idx + 1}
                      </td>
                      <td className="py-2 px-1 sm:px-2 min-w-[60px] sm:min-w-[100px]">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={user.profilePic || '/avatar.png'}
                            alt={user.name}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border object-cover shadow ${isTop1 ? 'border-yellow-400' : isTop2 ? 'border-gray-400' : isTop3 ? 'border-amber-400' : 'border-base-300'}`}
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/avatar.png'; }}
                          />
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-semibold text-base-content leading-tight">{user.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-1 sm:px-2 font-bold text-primary text-center align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          {user.stats?.level ?? user.level ?? '-'}
                        </div>
                      </td>
                      <td className="py-2 px-1 sm:px-2 font-semibold text-base-content/90 text-center align-middle hidden sm:table-cell">
                        {user.stats?.totalInterviews ?? '-'}
                      </td>
                      <td className="py-2 px-1 sm:px-2 font-semibold text-base-content/90 text-center align-middle hidden sm:table-cell">
                        {user.stats?.averageScore ?? '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center text-base-content/60 text-sm">
          <Award className="inline w-5 h-5 text-primary mr-1" />
          The leaderboard is updated in real-time. Compete, improve, and climb to the top!
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
