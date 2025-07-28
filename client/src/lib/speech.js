class SpeechManager {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.onSpeechResult = null;
        this.onSpeechError = null;
        this.onSpeechStart = null;
        this.onSpeechEnd = null;
        this.onTTSStart = null;
        this.onTTSEnd = null;
        this.onTTSError = null;
        
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.isListening = true;
                if (this.onSpeechStart) this.onSpeechStart();
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.isListening = false;
                if (this.onSpeechEnd) this.onSpeechEnd();
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Speech recognized:', transcript);
                if (this.onSpeechResult) this.onSpeechResult(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (this.onSpeechError) this.onSpeechError(event.error);
            };
        } else {
            console.error('Speech recognition not supported');
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                if (this.onSpeechError) this.onSpeechError(error);
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    speak(text, options = {}) {
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set default options
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;
            utterance.lang = options.lang || 'en-US';
            
            // Set voice if available
            const voices = this.synthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Natural') ||
                voice.name.includes('Enhanced')
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            utterance.onstart = () => {
                console.log('TTS started:', text);
                if (this.onTTSStart) this.onTTSStart();
            };
            
            utterance.onend = () => {
                console.log('TTS ended');
                if (this.onTTSEnd) this.onTTSEnd();
            };
            
            utterance.onerror = (event) => {
                console.error('TTS error:', event.error);
                if (this.onTTSError) this.onTTSError(event.error);
            };
            
            this.synthesis.speak(utterance);
        } else {
            console.error('Speech synthesis not supported');
        }
    }

    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    isSupported() {
        return !!(this.recognition && this.synthesis);
    }

    // Event handlers
    onSpeechResult(callback) {
        this.onSpeechResult = callback;
    }

    onSpeechError(callback) {
        this.onSpeechError = callback;
    }

    onSpeechStart(callback) {
        this.onSpeechStart = callback;
    }

    onSpeechEnd(callback) {
        this.onSpeechEnd = callback;
    }

    onTTSStart(callback) {
        this.onTTSStart = callback;
    }

    onTTSEnd(callback) {
        this.onTTSEnd = callback;
    }

    onTTSError(callback) {
        this.onTTSError = callback;
    }
}

export const speechManager = new SpeechManager();