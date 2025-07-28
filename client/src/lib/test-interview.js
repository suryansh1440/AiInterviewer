// Test file for custom interview system
import { interviewSocket } from './socket.js';
import { speechManager } from './speech.js';

export const testInterviewSystem = () => {
    console.log('Testing interview system...');
    
    // Test socket connection
    console.log('Testing socket connection...');
    interviewSocket.connect('test-user-id');
    
    // Test speech manager
    console.log('Testing speech manager...');
    console.log('Speech supported:', speechManager.isSupported());
    
    // Test interview data
    const testInterviewData = {
        questions: [
            "Tell me about yourself",
            "What are your strengths and weaknesses?",
            "Why do you want to work here?"
        ],
        leetcode: "Test LeetCode data",
        resume: "Test resume data",
        github: "Test GitHub data",
        name: "Test User",
        topic: "Software Engineering",
        subTopic: "Web Development",
        level: "medium"
    };
    
    // Test starting interview
    interviewSocket.onConnect(() => {
        console.log('Socket connected, starting test interview...');
        interviewSocket.startInterview(testInterviewData);
    });
    
    interviewSocket.onMessage((data) => {
        console.log('Received interview message:', data);
    });
    
    interviewSocket.onError((error) => {
        console.error('Interview error:', error);
    });
    
    interviewSocket.onComplete((data) => {
        console.log('Interview completed:', data);
    });
    
    return {
        testSocket: interviewSocket,
        testSpeech: speechManager,
        testData: testInterviewData
    };
};