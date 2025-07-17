import React from 'react';
import { useInterviewHistoryStore } from '../store/useInterviewHistoryStore';

const AttemptSidebar = () => {
  const {interviews,showInterview,setShowInterview} = useInterviewHistoryStore();

  return (
    <aside className="w-64 max-h-[90vh] bg-base-200 border-r border-base-300 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-primary">Previous Interviews</h2>
      <ul className="menu menu-lg rounded-box gap-2">
        {interviews.map((interview) => {
          const trimmedTopic = interview.topic.length > 15 ? interview.topic.slice(0, 12) + '...' : interview.topic;
          return (
            <li key={interview._id}>
              <button
                className={`w-full text-left btn btn-ghost justify-start ${showInterview === interview._id ? 'bg-primary text-primary-content' : ''}`}
                onClick={() => setShowInterview(interview._id)}
                title={interview.topic}
              >
                {trimmedTopic}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AttemptSidebar;
