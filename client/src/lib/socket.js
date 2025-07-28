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

        // Get backend URL from environment or use default
        const backendUrl = import.meta.env?.VITE_BACKEND_URL || 
                          process.env?.REACT_APP_BACKEND_URL || 
                          'http://localhost:5000';

        this.socket = io(backendUrl, {
            query: { userId }
        });

        this.socket.on('connect', () => {
            this.isConnected = true;
            if (this.onConnectCallback) this.onConnectCallback();
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            if (this.onDisconnectCallback) this.onDisconnectCallback();
        });

        this.socket.on('interview-message', (data) => {
            if (this.onMessageCallback) this.onMessageCallback(data);
        });

        this.socket.on('interview-error', (error) => {
            console.error('Interview error:', error);
            if (this.onErrorCallback) this.onErrorCallback(error);
        });

        this.socket.on('interview-complete', (data) => {
            if (this.onCompleteCallback) this.onCompleteCallback(data);
        });
    }

    startInterview(interviewData) {
        if (!this.socket || !this.isConnected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('start-interview', interviewData);
    }

    sendUserResponse(userMessage) {
        if (!this.socket || !this.isConnected) {
            throw new Error('Socket not connected');
        }
        
        this.socket.emit('user-response', userMessage);
    }

    endInterview() {
        if (!this.socket || !this.isConnected) {
            throw new Error('Socket not connected');
        }
        console.log('Sending end-interview signal to backend');
        this.socket.emit('end-interview');
    }

    forceCleanup() {
        if (this.socket && this.isConnected) {
            console.log('Force cleaning up interview session');
            this.socket.emit('end-interview');
        }
        this.disconnect();
    }

    disconnect() {
        if (this.socket) {
            console.log('Disconnecting socket');
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