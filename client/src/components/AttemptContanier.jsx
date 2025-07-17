import React from 'react';
import { useInterviewHistoryStore } from '../store/useInterviewHistoryStore';

const statusColor = {
  Passed: 'badge-success',
  Failed: 'badge-error',
};

const AttemptContanier = () => {
  const {interviews,showInterview} = useInterviewHistoryStore();
  const interview = interviews.find((i) => i._id === showInterview);

  return (
    <main className="flex-1 p-8 bg-base-100 max-h-[90vh] flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">{interview.topic}</h1>
          <div className="flex flex-wrap gap-2 text-base-content">
            <span className="badge badge-outline">Date: {interview.date}</span>
            <span className={`badge ${statusColor[interview.status] || 'badge-neutral'}`}>Status: {interview.status}</span>
            <span className="badge badge-info">Score: {interview.score}</span>
            <span className="badge badge-secondary">Topic: {interview.topic}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-base-content">Questions & Answers</h2>
        <ul className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          {interview.questions.map((qa, idx) => (
            <li key={idx} className="bg-base-200 rounded-lg p-6 shadow flex flex-col gap-2">
              <div className="font-semibold text-base-content">Q{idx + 1}: {qa.q}</div>
              <div className="text-base-content/80 pl-4 border-l-4 border-primary">{qa.a}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default AttemptContanier;
