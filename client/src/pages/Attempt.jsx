import React, { useEffect } from 'react';
import AttemptSidebar from '../components/AttemptSidebar';
import AttemptContanier from '../components/AttemptContanier';
import { Link } from 'react-router-dom';
import { useInterviewStore } from '../store/useInterviewStore';
import { Loader } from 'lucide-react';

const Attempt = () => {
  const { interviews,isGettingInterviews,isCreatingFeedback } = useInterviewStore();


  if(isGettingInterviews) return (
    <div className='flex items-center justify-center h-screen'>
    <Loader className='size-10 animate-spin' />
  </div>
  )

  if(isCreatingFeedback) return (
    <div className='flex items-center justify-center h-screen bg-base-200'>
        <div className='flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl bg-base-100 border border-primary/20'>
            <Loader className='w-16 h-16 text-primary animate-spin' />
            <div className='text-xl font-bold text-primary'>Generating Interview Feedback...</div>
            <div className='text-base text-base-content/70'>Please wait while we analyze your interview and generate detailed feedback.</div>
        </div>
    </div>
)


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
