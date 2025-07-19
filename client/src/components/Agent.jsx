import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { PhoneCall, PhoneOff } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';

const Agent = () => {
    const [isSpeaking, setIsSpeaking] = useState(true);
    const { user } = useAuthStore();
    const [callStatus, setCallStatus] = useState("Active");
    const { messages } = useInterviewStore();
    const [lastMessage, setLastMessage] = useState(messages[messages.length - 1]);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setLastMessage(messages[messages.length - 1]);
    }, [messages]);

    useEffect(() => {
        setFadeIn(false);
        const timeout = setTimeout(() => setFadeIn(true), 10);
        return () => clearTimeout(timeout);
    }, [lastMessage]);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full py-10">
                {/* Agent Card */}
                <div className="card w-[30rem] min-h-[22rem] border-1 bg-gradient-to-br from-purple-900 from-10% via-black via-50% to-black to-100% shadow-xl p-12 flex flex-col items-center justify-center rounded-2xl overflow-hidden">
                    <div className="relative w-32 h-28 flex items-center justify-center mb-4">
                        {isSpeaking && (
                            <span className="absolute inline-flex h-25 w-25 rounded-full bg-primary/30 animate-ping z-0"></span>
                        )}
                        <img
                            src="/avatar.png"
                            alt="Agent avatar"
                            className="w-28 h-28 rounded-full object-cover shadow-md relative z-10"
                        />
                    </div>
                    <h2 className="font-bold text-2xl text-white mb-2 text-center">AI Interviewer</h2>
                </div>

                {/* User Card */}
                <div className="card w-[30rem] min-h-[22rem] border-1 bg-gradient-to-bl from-gray-900 from-10% via-black via-50% to-black to-100% shadow-xl p-12 flex flex-col items-center justify-center rounded-2xl overflow-hidden">
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

            {/* messages  */}
            {messages.length > 0 && (
                <div className="w-full flex justify-center my-4">
                    <div className="bg-gradient-to-bl from-gray-900 from-10% via-black via-50% to-black to-100% rounded-xl shadow-inner p-4 border border-base-300 max-w-2xl w-full flex justify-center">
                        <p
                            key={lastMessage}
                            className={`text-base font-medium text-center text-base-content break-words transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* call buttons */}
            <div className='w-full flex justify-center'>
                {callStatus !== "Active" ? (
                    <button
                        className="btn btn-success flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-150 animate-pulse"
                    >
                        <PhoneCall className="w-5 h-5" />
                        <span>
                            {callStatus === 'Inactive' || callStatus === 'Finished' ? "Call" : "..."}
                        </span>
                    </button>
                ) : (
                    <button
                        className="btn btn-error flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-150"
                    >
                        <PhoneOff className="w-5 h-5" />
                        <span>End</span>
                    </button>
                )}
            </div>
        </>
    );
}

export default Agent;
