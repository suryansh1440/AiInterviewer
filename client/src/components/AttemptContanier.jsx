import React from 'react';
import { Star, Calendar, CheckCircle, XCircle, Award, MessageCircle } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';

const statusColor = {
  completed: 'text-success',
  not_completed: 'text-base-content/50',
};

const AttemptContanier = () => {
  const { interviews, showInterview, } = useInterviewStore();
  const interview = interviews.find((i) => i._id === showInterview) || interviews[0];

  if (!interview) return null;

  return (
    <main className="flex-1 px-0 py-12 bg-gradient-to-br from-base-100 via-primary/5 to-secondary/10 flex flex-col items-center w-full overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-base-200">
      {/* Interview Summary (full width, no box) */}
      <section className="w-full max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-12 border-b-2 border-base-300 pb-10 px-10">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-7 h-7 text-accent" />
            <span className="text-3xl font-bold text-primary">{interview.topic}</span>
          </div>
          <div className="flex flex-wrap gap-6 text-base-content/80 text-lg mt-2">
            <span className="inline-flex items-center gap-2"><Calendar className="w-5 h-5" />{new Date(interview.createdAt).toLocaleDateString()}</span>
            <span className={`inline-flex items-center gap-2 font-semibold ${statusColor[interview.status]}`}>{interview.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />} {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}</span>
            {interview.feedback && (
              <span className="inline-flex items-center gap-2 font-semibold text-info"><Award className="w-5 h-5" />Score: {interview.feedback.totalScore ?? 'N/A'}</span>
            )}
            <span className="inline-flex items-center gap-2 font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 text-primary border border-primary/30 shadow-sm">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9 2-7-7 7-7-9 2-2-9-2 9-9-2 7 7-7 7 9-2z" /></svg>
              Level: <span className="font-bold ml-1 capitalize">{interview.level}</span>
            </span>
          </div>
        </div>
        {interview.status === 'completed' && interview.feedback ? (
          <div className="flex flex-col gap-3 min-w-[260px]">
            <div className="font-semibold text-base-content/80 mb-1 text-xl">Feedback Summary</div>
            <div className="flex flex-wrap gap-3 mb-2">
              {interview.feedback.categoryScores?.map((cat, idx) => (
                <span key={idx} className="text-sm px-3 py-2 rounded bg-base-200 font-semibold border border-base-300">
                  {cat.name}: <span className="font-bold ml-1">{cat.score}</span>
                </span>
              ))}
            </div>
            <div className="flex flex-row gap-8">
              <div>
                <div className="text-sm text-success font-semibold mb-1">Strengths</div>
                <ul className="list-disc list-inside text-sm text-base-content/70">
                  {interview.feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-sm text-error font-semibold mb-1">Areas for Improvement</div>
                <ul className="list-disc list-inside text-sm text-base-content/70">
                  {interview.feedback.areasForImprovement?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
            <div className="mt-3 text-base text-base-content/80 italic border-l-4 border-primary pl-3">
              {interview.feedback.finalAssessment}
            </div>
          </div>
        ) : interview.status !== 'completed' && (
          <div className="flex flex-col gap-3 min-w-[260px] items-center justify-center">
            <div className="font-semibold text-base-content/60 text-lg mt-8">Feedback not generated yet.</div>
          </div>
        )}
      </section>
      {/* Questions & Answers (full width, no box) */}
      <section className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-10">
        <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-3"><MessageCircle className="w-6 h-6 text-primary" />Questions</h2>
        <ul className="space-y-6">
          {interview.questions.map((q, idx) => (
            <li key={idx} className="bg-base-200 rounded-xl p-7 shadow-sm flex flex-col gap-3 border border-base-300">
              <div className="font-semibold text-lg text-base-content">Q{idx + 1}: {q}</div>
              {/* If you have answers, display them here. */}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default AttemptContanier;
