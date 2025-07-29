import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/useInterviewStore';
import { speechManager } from '../lib/speech.js';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const Agent = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const {
        isInterviewActive,
        messages,
        createFeedback,
        interviewData,
        isCreatingFeedback,
        sendUserMessage,
        endInterview,
        disconnectInterview,
        resetInterviewState
    } = useInterviewStore();

    const [fadeIn, setFadeIn] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const lastMessage = messages[messages.length - 1];

    useEffect(() => {
        setFadeIn(false);
        const timeout = setTimeout(() => setFadeIn(true), 10);
        return () => clearTimeout(timeout);
    }, [lastMessage]);

    useEffect(() => {
        // Check if speech recognition is supported
        setIsSpeechSupported(speechManager.isSupported());

        // Set up speech recognition event handlers
        speechManager.onSpeechResult((transcript) => {
            console.log('Speech recognized:', transcript);
            sendUserMessage(transcript);
        });

        speechManager.onSpeechError((error) => {
            console.error('Speech recognition error:', error);
            toast.error('Speech recognition error. Please try again.');
        });

        speechManager.onSpeechStart(() => {
            console.log('Speech recognition started');
            setIsListening(true);
        });

        speechManager.onSpeechEnd(() => {
            console.log('Speech recognition ended');
            setIsListening(false);
        });

        speechManager.onTTSStart(() => {
            console.log('TTS started');
            setIsSpeaking(true);
        });

        speechManager.onTTSEnd(() => {
            console.log('TTS ended');
            setIsSpeaking(false);
            // Start listening for user response after AI finishes speaking
            if (isInterviewActive) {
                setTimeout(() => {
                    if (speechManager.isSupported()) {
                        speechManager.startListening();
                    }
                }, 500);
            }
        });

        // Cleanup on unmount
        return () => {
            console.log('Agent component unmounting, cleaning up...');
            speechManager.stopListening();
            speechManager.stopSpeaking();
            resetInterviewState();
        };
    }, [isInterviewActive]);

    // Handle AI messages with text-to-speech
    useEffect(() => {
        if (lastMessage && lastMessage.role === 'interviewer' && isInterviewActive) {
            // Speak the AI message
            speechManager.speak(lastMessage.content, {
                rate: 0.9,
                pitch: 1,
                volume: 1
            });
        }
    }, [lastMessage, isInterviewActive]);

    // Auto-end interview if isInterviewEnd is true in the last message
    useEffect(() => {
        if (lastMessage && lastMessage.isInterviewEnd) {
            console.log('Interview end detected, scheduling disconnect...');
            const timer = setTimeout(() => {
                handleDisconnect();
            }, lastMessage.content.length < 150 ? 12000 : 20000); 
            return () => clearTimeout(timer);
        }
    }, [lastMessage]);

    const handleDisconnect = async () => {
        try {
            console.log('Handling interview disconnect...');
            
            // Stop all speech activities first
            speechManager.stopListening();
            speechManager.stopSpeaking();
            
            // Update local state to reflect microphone is off
            setIsListening(false);
            setIsSpeaking(false);
            
            // Get the interview ID and conversation history
            const { interviewData, messages } = useInterviewStore.getState();
            const interviewId = interviewData?._id || interviewData?.interview?._id;
            
            if (interviewId && messages.length > 0) {
                // Convert messages to conversation history format
                const conversationHistory = messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));
                
                // Create feedback with conversation history
                await createFeedback(interviewId, conversationHistory);
            }
            
            // Reset all interview state and disconnect
            resetInterviewState();
            endInterview();
            navigate("/dashboard/attempt");
        } catch (error) {
            console.error('Error ending interview:', error);
            toast.error('Error ending interview');
        }
    };

    const toggleListening = () => {
        if (isListening) {
            speechManager.stopListening();
        } else {
            speechManager.startListening();
        }
    };

    if(isCreatingFeedback) return (
        <div className='flex items-center justify-center h-screen bg-base-200'>
            <div className='flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl bg-base-100 border border-primary/20'>
                <Loader className='w-16 h-16 text-primary animate-spin' />
                <div className='text-xl font-bold text-primary'>Generating Interview Feedback...</div>
                <div className='text-base text-base-content/70'>Please wait while we analyze your interview and generate detailed feedback.</div>
            </div>
        </div>
    );

    if (!isInterviewActive) {
        return (
            <div className='flex items-center justify-center h-screen bg-base-200'>
                <div className='flex flex-col items-center gap-6 p-10 rounded-2xl shadow-xl bg-base-100 border border-primary/20'>
                    <Loader className='w-16 h-16 text-primary animate-spin' />
                    <div className='text-xl font-bold text-primary'>Starting Interview...</div>
                    <div className='text-base text-base-content/70'>Please wait while we connect to the interview server.</div>
                </div>
            </div>
        );
    }

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
                    {isSpeaking && (
                        <div className="flex items-center gap-2 text-primary">
                            <Volume2 className="w-4 h-4" />
                            <span className="text-sm">Speaking...</span>
                        </div>
                    )}
                </div>

                {/* User Card */}
                <div className="hidden md:flex card md:w-[30rem] min-h-[22rem] border-1 bg-gradient-to-bl from-gray-900 from-10% via-black via-50% to-black to-100% shadow-xl md:p-12 flex-col items-center justify-center rounded-2xl overflow-hidden">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                        {isListening && (
                            <span className="absolute inline-flex h-25 w-25 rounded-full bg-accent/30 animate-ping z-0"></span>
                        )}
                        <img
                            src={user?.profilePic || "/avatar.png"}
                            alt="User avatar"
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }}
                            className="w-28 h-28 rounded-full object-cover shadow-md relative z-10"
                        />
                    </div>
                    <h2 className="font-bold text-2xl text-white mb-2 text-center">{user?.name || 'User'}</h2>
                    {isListening && (
                        <div className="flex items-center gap-2 text-accent">
                            <Mic className="w-4 h-4" />
                            <span className="text-sm">Listening...</span>
                        </div>
                    )}
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
            <div className='w-full flex justify-center gap-4'>
                {isInterviewActive && (
                    <>
                        {isSpeechSupported && (
                            <button
                                onClick={toggleListening}
                                className={`btn flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-150 ${
                                    isListening ? 'btn-accent' : 'btn-primary'
                                }`}
                                disabled={isSpeaking}
                            >
                                {isListening ? (
                                    <>
                                        <MicOff className="w-5 h-5" />
                                        <span>Stop Listening</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-5 h-5" />
                                        <span>Start Listening</span>
                                    </>
                                )}
                            </button>
                        )}
                        
                        <button
                            onClick={handleDisconnect}
                            className="btn btn-error flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-150"
                        >
                            <PhoneOff className="w-5 h-5" />
                            <span>End Interview</span>
                        </button>
                    </>
                )}
            </div>

            {/* Speech support warning */}
            {!isSpeechSupported && (
                <div className="w-full flex justify-center mt-4">
                    <div className="bg-warning/20 border border-warning/30 rounded-lg p-4 max-w-md">
                        <p className="text-warning text-center text-sm">
                            Speech recognition is not supported in your browser. 
                            Please use Chrome, Edge, or Safari for the best experience.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Agent;
