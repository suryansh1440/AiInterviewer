import { io } from 'socket.io-client';

class InterviewSocket {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.onMessageCallback = null;
        this.onErrorCallback = null;
        this.onCompleteCallback = null;
        this.onConnectCallback = null;
        this.onDisconnectCallback = null;
    }

    connect(userId) {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
            query: { userId }
        });

        this.socket.on('connect', () => {
            console.log('Connected to interview server');
            this.isConnected = true;
            if (this.onConnectCallback) this.onConnectCallback();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from interview server');
            this.isConnected = false;
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        });

        this.socket.on('interview-message', (data) => {
            console.log('Received interview message:', data);
            if (this.onMessageCallback) this.onMessageCallback(data);
        });

        this.socket.on('interview-error', (error) => {
            console.error('Interview error:', error);
            if (this.onErrorCallback) this.onErrorCallback(error);
        });

        this.socket.on('interview-complete', (data) => {
            console.log('Interview completed:', data);
            if (this.onCompleteCallback) this.onCompleteCallback(data);
        });
    }

    startInterview(interviewData) {
        if (!this.socket || !this.isConnected) {
            throw new Error('Socket not connected');
        }
        console.log('Starting interview with data:', interviewData);
        this.socket.emit('start-interview', interviewData);
    }

    sendUserResponse(userMessage) {
        if (!this.socket || !this.isConnected) {
            throw new Error('Socket not connected');
        }
        console.log('Sending user response:', userMessage);
        this.socket.emit('user-response', userMessage);
    }

    endInterview() {
        if (!this.socket || !this.isConnected) {
            throw new Error('Socket not connected');
        }
        console.log('Ending interview');
        this.socket.emit('end-interview');
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Event handlers
    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }

    onComplete(callback) {
        this.onCompleteCallback = callback;
    }

    onConnect(callback) {
        this.onConnectCallback = callback;
    }

    onDisconnect(callback) {
        this.onDisconnectCallback = callback;
    }
}

export const interviewSocket = new InterviewSocket();