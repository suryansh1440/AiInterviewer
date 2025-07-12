import React, { useState } from 'react';
import { Mic, Zap, UserCircle, Keyboard, Clock, Star, Video, CheckCircle, XCircle, Send } from 'lucide-react';

const InterviewPage = () => {
  const [tab, setTab] = useState('record');
  const [writtenAnswer, setWrittenAnswer] = useState('');

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-5xl bg-base-100 rounded-2xl shadow-xl p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">AI-Powered Interview</h1>
          <p className="text-base-content/70 text-lg">Practice with our intelligent interviewer that adapts to your answers and provides real-time feedback</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Question Section */}
          <div className="flex-1 card bg-base-200 p-6 rounded-xl shadow flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 text-primary rounded-full p-2"><Star className="w-6 h-6" /></div>
              <h2 className="text-xl font-semibold text-base-content">Interview Question</h2>
            </div>
            <div className="text-base-content/80 text-md mb-2">
              Your interview question will appear here. Take your time to read and prepare your answer. When you're ready, click the "Start" button to begin recording your response.
            </div>
            <div className="flex gap-4 text-sm text-base-content/60">
              <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> Expected answer: 2-3 minutes</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4" /> Behavioral question</div>
            </div>
          </div>
          {/* Demo Section */}
          <div className="flex-1 card bg-base-200 p-6 rounded-xl shadow flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-secondary/10 text-secondary rounded-full p-2"><Video className="w-6 h-6" /></div>
              <h2 className="text-xl font-semibold text-base-content">Your Response</h2>
            </div>
            <div className="flex gap-2 mb-4">
              <button
                className={`btn btn-sm flex-1 ${tab === 'record' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTab('record')}
              >
                <Mic className="w-4 h-4 mr-1" /> Record Answer
              </button>
              <button
                className={`btn btn-sm flex-1 ${tab === 'write' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTab('write')}
              >
                <Keyboard className="w-4 h-4 mr-1" /> Write Answer
              </button>
            </div>
            <div className="flex-1">
              {tab === 'record' ? (
                <div className="flex flex-col items-center justify-center gap-2 h-48">
                  <UserCircle className="w-16 h-16 text-base-content/40" />
                  <h3 className="text-lg font-semibold text-base-content">Ready When You Are</h3>
                  <p className="text-base-content/70 text-center">This area will display your webcam feed and record your responses. Make sure you're in a well-lit, quiet environment.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <textarea
                    className="textarea textarea-bordered w-full min-h-[120px]"
                    placeholder="Type your answer here..."
                    value={writtenAnswer}
                    onChange={e => setWrittenAnswer(e.target.value)}
                  />
                  <button className="btn btn-accent self-end flex items-center gap-2">
                    <Send className="w-4 h-4" /> Submit Answer
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4 text-base-content/70">
              <Clock className="w-4 h-4" /> <span>00:00</span>
            </div>
          </div>
        </div>
        {/* Interview Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <button className="btn btn-primary flex-1 flex items-center gap-2">
            <Mic className="w-5 h-5" /> Start Answering
          </button>
          <button className="btn btn-success flex-1 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Finish Answer
          </button>
          <button className="btn btn-error flex-1 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> End Interview
          </button>
        </div>
      </div>
      <footer className="w-full text-center mt-10 text-base-content/60">
        <p>&copy; 2025 AI Interviewer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InterviewPage;
