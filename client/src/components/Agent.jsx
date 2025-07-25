import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { PhoneOff, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Agent = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const {
        interviewData,
        aiResponse,
        isAIResponding,
        sendTranscriptToAI,
        listenForAIResponse,
        stopListeningForAIResponse,
        createFeedback,
        isCreatingFeedback
    } = useInterviewStore();
    const [messages, setMessages] = useState([]); // {role: 'user'|'ai', content: string}
    const [input, setInput] = useState('');
    const inputRef = useRef();

    // Listen for AI responses
    useEffect(() => {
        listenForAIResponse();
        return () => stopListeningForAIResponse();
    }, []);

    // Add AI response to messages
    useEffect(() => {
        if (aiResponse) {
            setMessages((prev) => [...prev, { role: 'ai', content: aiResponse }]);
        }
    }, [aiResponse]);

    // Scroll to bottom on new message
    const messagesEndRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Handle user send
    const handleSend = (e) => {
        e.preventDefault();
        const transcript = input.trim();
        if (!transcript) return;
        setMessages((prev) => [...prev, { role: 'user', content: transcript }]);
        setInput('');
        sendTranscriptToAI(transcript, {
            questions: interviewData?.questions || [],
            resume: interviewData?.resume || '',
            leetcodeStats: interviewData?.leetcodeStats || ''
        });
    };

    if (isCreatingFeedback) return (
        <div className='flex items-center justify-center h-screen bg-base-200'>
            <div className='flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl bg-base-100 border border-primary/20'>
                <Loader className='w-16 h-16 text-primary animate-spin' />
                <div className='text-xl font-bold text-primary'>Generating Interview Feedback...</div>
                <div className='text-base text-base-content/70'>Please wait while we analyze your interview and generate detailed feedback.</div>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full py-10">
                {/* Agent Card */}
                <div className="card w-full max-w-xs md:max-w-none md:w-[30rem] min-h-[22rem] border-1 bg-gradient-to-br from-purple-900 from-10% via-black via-50% to-black to-100% shadow-xl p-4 md:p-12 flex flex-col items-center justify-center rounded-2xl overflow-hidden">
                    <div className="relative w-32 h-28 flex items-center justify-center mb-4">
                        <img
                            src="/avatar.png"
                            alt="Agent avatar"
                            className="w-28 h-28 rounded-full object-cover shadow-md relative z-10"
                        />
                    </div>
                    <h2 className="font-bold text-2xl text-white mb-2 text-center">AI Interviewer</h2>
                </div>
                {/* User Card */}
                <div className="hidden md:flex card md:w-[30rem] min-h-[22rem] border-1 bg-gradient-to-bl from-gray-900 from-10% via-black via-50% to-black to-100% shadow-xl md:p-12 flex-col items-center justify-center rounded-2xl overflow-hidden">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                        <img
                            src={user?.profilePic || "/avatar.png"}
                            alt="User avatar"
                            className="w-28 h-28 rounded-full object-cover shadow-md relative z-10"
                        />
                    </div>
                    <h2 className="font-bold text-2xl text-white mb-2 text-center">{user?.name || 'User'}</h2>
                </div>
            </div>

            {/* Chat messages */}
            <div className="w-full flex flex-col items-center my-4">
                <div className="bg-gradient-to-bl from-gray-900 from-10% via-black via-50% to-black to-100% rounded-xl shadow-inner p-4 border border-base-300 max-w-2xl w-full flex flex-col gap-2 min-h-[200px] max-h-[400px] overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`text-base font-medium break-words ${msg.role === 'ai' ? 'text-primary' : 'text-base-content'} text-left`}>{msg.role === 'ai' ? 'AI: ' : 'You: '}{msg.content}</div>
                    ))}
                    {isAIResponding && (
                        <div className="flex items-center gap-2 text-primary text-base font-medium"><Loader className="w-4 h-4 animate-spin" />AI is thinking...</div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input box */}
                <form onSubmit={handleSend} className="flex gap-2 w-full max-w-2xl mt-4">
                    <input
                        ref={inputRef}
                        type="text"
                        className="input input-bordered flex-1 text-base rounded-xl bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Type your answer or question..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isAIResponding}
                        maxLength={500}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="btn btn-primary px-6 py-2 rounded-xl font-semibold text-base shadow-md hover:scale-105 transition-transform disabled:opacity-60"
                        disabled={isAIResponding || !input.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}

export default Agent;
