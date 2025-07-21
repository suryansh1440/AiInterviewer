import React from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';

const statusColor = {
  completed: 'text-success',
  not_completed: 'text-base-content/50',
};

const AttemptSidebar = () => {
  const { interviews, showInterview, setShowInterview } = useInterviewStore();

  return (
    <aside className="w-72 max-h-[90vh] bg-base-200 border-r border-base-300 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2 mt-3 text-primary">Previous Interviews</h2>
      <ul className="flex flex-col gap-2">
        {interviews.map((interview) => {
          const trimmedTopic = interview.topic.length > 18 ? interview.topic.slice(0, 15) + '...' : interview.topic;
          const isSelected = showInterview === interview._id;
          return (
            <li key={interview._id}>
              <button
                className={`w-full flex flex-col items-start gap-1 rounded-lg px-4 py-3 transition-all duration-150 border border-transparent hover:border-primary/40 hover:bg-primary/10 focus:outline-none ${isSelected ? 'bg-secondary text-primary-content border-2 border-primary shadow' : 'bg-base-100 text-base-content'}`}
                onClick={() => setShowInterview(interview._id)}
                title={interview.topic}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-semibold truncate flex-1">{trimmedTopic}</span>
                  <span className={`text-xs flex items-center gap-1 ${statusColor[interview.status]}`}>{interview.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-base-content/60 mt-1">
                  <Calendar className="w-3 h-3" /> {new Date(interview.createdAt).toLocaleDateString()}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AttemptSidebar;
