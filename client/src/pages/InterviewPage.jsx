import React, { useEffect } from 'react'
import Agent from '../components/Agent'
import { useInterviewStore } from '../store/useInterviewStore'
import { useNavigate } from 'react-router-dom'

const InterviewPage = () => {
  const { interviewData,isInterviewActive } = useInterviewStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!isInterviewActive){
      navigate('/');
    }
  }, []);
  

  return (
    <div className="min-h-screen w-full bg-base-200 font-inter flex flex-col items-center py-6 px-2">
      {/* Modern, non-boxed topic & difficulty display (compact) */}
      <div className="w-full max-w-xl mx-auto flex flex-row items-center justify-center gap-6 mt-6 mb-8">
        <div className="flex flex-col items-center">
          <span className="uppercase text-xs text-base-content/60 tracking-widest mb-0.5">Topic</span>
          <span className="text-lg font-bold text-primary tracking-tight">{interviewData?.topic || 'N/A'}</span>
        </div>
        <div className="h-8 w-px bg-base-300 mx-2 rounded-full" />
        <div className="flex flex-col items-center">
          <span className="uppercase text-xs text-base-content/60 tracking-widest mb-0.5">Difficulty</span>
          <span className={`text-base font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 text-primary border border-primary/20 shadow-sm capitalize`}>{interviewData?.level || 'N/A'}</span>
        </div>
      </div>
      <Agent/>
    </div>
  )
}

export default InterviewPage
