import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { PhoneOff } from 'lucide-react';
import { vapi } from '../lib/vapi.sdk';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/useInterviewStore';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const Agent = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { user } = useAuthStore();
    const [callStatus, setCallStatus] = useState("Inactive");
    const [messages,setMessages] = useState([]);
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();
    const {createFeedback,interviewData,isCreatingFeedback} = useInterviewStore();

    const lastMessage = messages[messages.length - 1];

    useEffect(() => {
        setFadeIn(false);
        const timeout = setTimeout(() => setFadeIn(true), 10);
        return () => clearTimeout(timeout);
    }, [lastMessage]);

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus("Active");
        };

        const onCallEnd = () => {
            setCallStatus("Finished");
        };

        const onMessage = (message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = {
                    role: message.role,
                    content: message.transcript
                };
                setMessages(prev => [...prev, newMessage]);
            }
        };

        const onSpeechStart = ()=>{
            setIsSpeaking(true);
        }

        const onSpeechEnd = ()=>{
            setIsSpeaking(false);
        }

        const onError=(error)=>{
            console.log("error",error)
        }


        vapi.on('call-start',onCallStart);
        vapi.on('call-end',onCallEnd);
        vapi.on('message',onMessage);
        vapi.on('speech-start',onSpeechStart);
        vapi.on('speech-end',onSpeechEnd);
        vapi.on('error',onError);

        return () => {
            if (typeof vapi.off === 'function') {
                vapi.off('call-start',onCallStart);
                vapi.off('call-end',onCallEnd);
                vapi.off('message',onMessage);
                vapi.off('speech-start',onSpeechStart);
                vapi.off('speech-end',onSpeechEnd);
                vapi.off('error',onError);
            }
        }
    }, []);

    useEffect(() => {
        if(callStatus === "Finished"){
            (async () => {
                const interview = await createFeedback(interviewData._id,messages);
                navigate("/dashboard/attempt");
            })();
        }
    },[messages,callStatus,user._id]);


    const handleDisconnect = async ()=>{
        setCallStatus("Finished");
            await vapi.stop();
    }

    if(isCreatingFeedback) return (
        <div className='flex items-center justify-center h-screen bg-base-200'>
            <div className='flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl bg-base-100 border border-primary/20'>
                <Loader className='w-16 h-16 text-primary animate-spin' />
                <div className='text-xl font-bold text-primary'>Generating Interview Feedback...</div>
                <div className='text-base text-base-content/70'>Please wait while we analyze your interview and generate detailed feedback.</div>
            </div>
        </div>
    )


    return (
        <>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 w-full py-10">
                {/* Agent Card */}
                <div className="card w-full max-w-xs md:max-w-none md:w-[30rem] min-h-[22rem] border-1 bg-gradient-to-br from-purple-900 from-10% via-black via-50% to-black to-100% shadow-xl p-4 md:p-12 flex flex-col items-center justify-center rounded-2xl overflow-hidden">
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

            {/* messages  */}
            {messages.length > 0 && (
                <div className="w-full flex justify-center my-4">
                    <div className="bg-gradient-to-bl from-gray-900 from-10% via-black via-50% to-black to-100% rounded-xl shadow-inner p-4 border border-base-300 max-w-2xl w-full flex justify-center">
                        <p
                            key={lastMessage?.content}
                            className={`text-base font-medium text-center text-base-content break-words transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {lastMessage?.content}
                        </p>
                    </div>
                </div>
            )}

            {/* call buttons */}
            <div className='w-full flex justify-center'>
                {callStatus === "Active" && (
                    <button
                        onClick={handleDisconnect}
                        className="btn btn-error flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-150"
                    >
                        <PhoneOff className="w-5 h-5" />
                        <span>End Interview</span>
                    </button>
                )}
            </div>
        </>
    );
}

export default Agent;
