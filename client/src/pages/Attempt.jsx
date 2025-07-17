import React from 'react';
import AttemptSidebar from '../components/AttemptSidebar';
import AttemptContanier from '../components/AttemptContanier';
import { useInterviewHistoryStore } from '../store/useInterviewHistoryStore';
import { Link } from 'react-router-dom';

const Attempt = () => {
  const { interviews } = useInterviewHistoryStore();

  if (!interviews || interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full bg-base-100">
        <div className="text-6xl mb-4 text-base-content/40">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-20 h-20 mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-base-content mb-2">No Previous Interviews</h2>
        <p className="text-base-content/70 mb-4">You haven't attempted any interviews yet. Start your first interview to see your history here!</p>
        <Link to="/start" className="btn btn-primary">Take an Interview</Link>
      </div>
    );
  }

  return (
    <div className='flex scrollbar-hide'>
      <AttemptSidebar />
      <AttemptContanier />
    </div>
  );
};
export default Attempt;
