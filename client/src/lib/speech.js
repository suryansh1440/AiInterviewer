class SpeechManager {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this._shouldBeListening = false;
        this._speechTimeout = null;
        this._interimTranscript = ''; // Track interim transcript
        this._lastInterimUpdate = 0; // Track when interim was last updated
        this._graceTimeout = null; // Grace period timer after final transcript
        this._pendingFinalTranscript = null; // Store pending final transcript
        this._onSpeechResult = null;
        this._onSpeechError = null;
        this._onSpeechStart = null;
        this._onSpeechEnd = null;
        this._onTTSStart = null;
        this._onTTSEnd = null;
        this._onTTSError = null;
        
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true; // Keep listening continuously
            this.recognition.interimResults = true; // Get interim results
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.isListening = true;
                this._interimTranscript = ''; // Reset interim transcript
                this._lastInterimUpdate = 0;
                if (this._onSpeechStart) this._onSpeechStart();
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.isListening = false;
                
                // Auto-restart if we're supposed to be listening
                if (this._shouldBeListening) {
                    console.log('Auto-restarting speech recognition...');
                    setTimeout(() => {
                        this.startListening();
                    }, 100);
                }
                
                if (this._onSpeechEnd) this._onSpeechEnd();
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                // Process all results
                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    const transcript = result[0].transcript;
                    
                    if (result.isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // Update interim transcript tracking
                if (interimTranscript.trim()) {
                    this._interimTranscript = interimTranscript.trim();
                    this._lastInterimUpdate = Date.now();
                    // Reset 8-second timeout when user speaks (even interim)
                    this._resetSpeechTimeout();
                    // If user speaks during grace period, clear grace timer
                    if (this._graceTimeout) {
                        clearTimeout(this._graceTimeout);
                        this._graceTimeout = null;
                        this._pendingFinalTranscript = null;
                    }
                }
                
                // If we have final results, process them
                if (finalTranscript.trim()) {
                    let transcript = finalTranscript.trim();
                    let confidence = event.results[event.results.length - 1][0].confidence;
                    
                    // If confidence is low, try alternative results
                    if (confidence < 0.7 && event.results[event.results.length - 1].length > 1) {
                        const alternative = event.results[event.results.length - 1][1];
                        if (alternative && alternative.confidence > confidence) {
                            transcript = alternative.transcript;
                            confidence = alternative.confidence;
                        }
                    }
                    
                    // Clean up the transcript for better processing
                    transcript = transcript.toLowerCase();
                    
                    
                    // Reset interim transcript since we got final result
                    this._interimTranscript = '';
                    this._lastInterimUpdate = 0;
                    
                    // Start 5-second grace period before sending final transcript
                    if (this._graceTimeout) {
                        clearTimeout(this._graceTimeout);
                    }
                    this._pendingFinalTranscript = transcript;
                    this._graceTimeout = setTimeout(() => {
                        if (this._pendingFinalTranscript) {
                            if (this._onSpeechResult) this._onSpeechResult(this._pendingFinalTranscript);
                            this._pendingFinalTranscript = null;
                            this.stopListening(); // End listening after sending
                        }
                    }, 2000); // 2 second grace period
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                if (this._onSpeechError) this._onSpeechError(event.error);
            };
        } else {
            console.error('Speech recognition not supported');
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            try {
                this._shouldBeListening = true;
                this._interimTranscript = ''; // Reset interim transcript
                this._lastInterimUpdate = 0;
                this.recognition.start();
                this._resetSpeechTimeout(); // Reset timeout when starting
            } catch (error) {
                if (this._onSpeechError) this._onSpeechError(error);
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this._shouldBeListening = false;
            this.recognition.stop();
            clearTimeout(this._speechTimeout); // Clear timeout when stopping
        }
    }

    // Handle speech timeout for better continuous listening
    _resetSpeechTimeout() {
        if (this._speechTimeout) {
            clearTimeout(this._speechTimeout);
        }
        
        // Set an 8-second timeout for user speech detection
        this._speechTimeout = setTimeout(() => {
            if (this.isListening && this._shouldBeListening) {
                
                // Check if we have any interim transcript
                const hasInterimTranscript = this._interimTranscript.trim().length > 0;
                
                if (hasInterimTranscript) {
                    // User spoke within 8 seconds, continue listening
                    this._resetSpeechTimeout(); // Reset the 8-second timer
                } else {
                    console.log('No speech detected for 8 seconds, sending empty response to backend...');
                    // No speech detected for 8 seconds, send empty response to backend
                    if (this._onSpeechResult) this._onSpeechResult('');
                    
                    // Reset interim transcript
                    this._interimTranscript = '';
                    this._lastInterimUpdate = 0;
                    
                    // Restart recognition for continuous listening
                    this.recognition.stop();
                }
            }
        }, 60000); // 1min timeout
    }

    // Clean text for better TTS pronunciation
    cleanTextForTTS(text) {
        if (!text) return '';
        
        let cleaned = text;
        
        // Common pronunciation fixes
        const pronunciationFixes = {
            'API': 'A P I',
            'JS': 'JavaScript',
            'HTML': 'H T M L',
            'CSS': 'C S S',
            'JSON': 'Jason',
            'URL': 'U R L',
            'HTTP': 'H T T P',
            'HTTPS': 'H T T P S',
            'SQL': 'S Q L',
            'NoSQL': 'No S Q L',
            'REST': 'Rest',
            'GraphQL': 'Graph Q L',
            'npm': 'N P M',
            'yarn': 'Yarn',
            'git': 'Git',
            'GitHub': 'Git Hub',
            'React': 'React',
            'Angular': 'Angular',
            'Vue': 'Vue',
            'Node.js': 'Node J S',
            'TypeScript': 'Type Script',
            'JavaScript': 'JavaScript',
            'Python': 'Python',
            'Java': 'Java',
            'C++': 'C Plus Plus',
            'C#': 'C Sharp',
            'PHP': 'P H P',
            'Ruby': 'Ruby',
            'Go': 'Go',
            'Rust': 'Rust',
            'Docker': 'Docker',
            'Kubernetes': 'Kubernetes',
            'AWS': 'A W S',
            'Azure': 'Azure',
            'GCP': 'G C P',
            'CI/CD': 'C I C D',
            'DevOps': 'Dev Ops',
            'UI/UX': 'U I U X',
            'AI': 'A I',
            'ML': 'Machine Learning',
            'API': 'A P I',
            'SDK': 'S D K',
            'IDE': 'I D E',
            'CLI': 'C L I',
            'GUI': 'G U I',
            'RESTful': 'Restful',
            'microservices': 'micro services',
            'frontend': 'front end',
            'backend': 'back end',
            'fullstack': 'full stack',
            'webpack': 'web pack',
            'babel': 'babel',
            'eslint': 'E S lint',
            'prettier': 'prettier',
            'jest': 'jest',
            'mocha': 'mocha',
            'chai': 'chai',
            'redux': 'redux',
            'mobx': 'mob x',
            'webpack': 'web pack',
            'vite': 'vite',
            'next.js': 'Next J S',
            'gatsby': 'gatsby',
            'nuxt.js': 'Nuxt J S',
            'express.js': 'Express J S',
            'mongoose': 'mongoose',
            'prisma': 'prisma',
            'sequelize': 'sequelize',
            'postgresql': 'PostgreSQL',
            'mysql': 'My S Q L',
            'mongodb': 'Mongo D B',
            'redis': 'redis',
            'elasticsearch': 'elastic search',
            'kafka': 'kafka',
            'rabbitmq': 'rabbit M Q',
            'nginx': 'nginx',
            'apache': 'apache',
            'docker': 'docker',
            'kubernetes': 'kubernetes',
            'jenkins': 'jenkins',
            'travis': 'travis',
            'circleci': 'circle C I',
            'github': 'Git Hub',
            'gitlab': 'Git Lab',
            'bitbucket': 'Bit Bucket',
            'jira': 'jira',
            'confluence': 'confluence',
            'slack': 'slack',
            'discord': 'discord',
            'zoom': 'zoom',
            'teams': 'teams',
            'figma': 'figma',
            'sketch': 'sketch',
            'invision': 'invision',
            'adobe': 'adobe',
            'photoshop': 'photo shop',
            'illustrator': 'illustrator',
            'xd': 'X D',
            'zeplin': 'zeplin',
            'abstract': 'abstract',
            'principle': 'principle',
            'framer': 'framer',
            'webflow': 'web flow',
            'wordpress': 'Word Press',
            'shopify': 'shopify',
            'woocommerce': 'Woo Commerce',
            'magento': 'magento',
            'prestashop': 'presta shop',
            'opencart': 'open cart',
            'stripe': 'stripe',
            'paypal': 'Pay Pal',
            'square': 'square',
            'twilio': 'twilio',
            'sendgrid': 'send grid',
            'mailchimp': 'mail chimp',
            'hubspot': 'hub spot',
            'salesforce': 'sales force',
            'zendesk': 'zen desk',
            'intercom': 'intercom',
            'drift': 'drift',
            'calendly': 'calendly',
            'typeform': 'type form',
            'survey monkey': 'survey monkey',
            'google analytics': 'Google Analytics',
            'mixpanel': 'mix panel',
            'amplitude': 'amplitude',
            'hotjar': 'hot jar',
            'optimizely': 'optimizely',
            'vwo': 'V W O',
            'ab testing': 'A B testing',
            'seo': 'S E O',
            'sem': 'S E M',
            'ppc': 'P P C',
            'cpc': 'C P C',
            'cpm': 'C P M',
            'ctr': 'C T R',
            'cvr': 'C V R',
            'roi': 'R O I',
            'kpi': 'K P I',
            'okr': 'O K R',
            'sprint': 'sprint',
            'agile': 'agile',
            'scrum': 'scrum',
            'kanban': 'kanban',
            'waterfall': 'waterfall',
            'lean': 'lean',
            'six sigma': 'six sigma',
            'pmp': 'P M P',
            'prince2': 'Prince Two',
            'itil': 'I T I L',
            'cobit': 'Cobit',
            'iso': 'I S O',
            'gdpr': 'G D P R',
            'ccpa': 'C C P A',
            'hipaa': 'H I P A A',
            'sox': 'S O X',
            'pci': 'P C I',
            'dss': 'D S S',
            'owasp': 'O W A S P',
            'nist': 'N I S T',
            'cis': 'C I S',
            'mitre': 'mitre',
            'cve': 'C V E',
            'cwe': 'C W E',
            'cve': 'C V E',
            'cwe': 'C W E',
            'cve': 'C V E',
            'cwe': 'C W E'
        };
        
        // Apply pronunciation fixes
        Object.entries(pronunciationFixes).forEach(([word, replacement]) => {
            // Escape special regex characters in the word
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
            cleaned = cleaned.replace(regex, replacement);
        });
        
        // Add pauses for better flow
        cleaned = cleaned.replace(/\./g, ' . ');
        cleaned = cleaned.replace(/,/g, ' , ');
        cleaned = cleaned.replace(/!/g, ' ! ');
        cleaned = cleaned.replace(/\?/g, ' ? ');
        
        // Remove extra spaces
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        return cleaned;
    }

    async speak(text, options = {}) {
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            // Stop listening before starting TTS
            this.stopListening();
            
            // Clean text for better pronunciation
            const cleanedText = this.cleanTextForTTS(text);
            
            const utterance = new SpeechSynthesisUtterance(cleanedText);
            
            // Set default options optimized for natural speech
            utterance.rate = options.rate || 0.85; // Slower for more natural pace
            utterance.pitch = options.pitch || 1.1; // Slightly higher pitch for clarity
            utterance.volume = options.volume || 0.9; // Slightly lower volume for natural sound
            utterance.lang = options.lang || 'en-US';
            
            // Get available voices
            const voices = this.synthesis.getVoices();
            
            // Get selected voice from store (import dynamically to avoid circular dependency)
            let selectedVoice = null;
            try {
                const { useSettingStore } = await import('../store/useSettingStore');
                const { INTERVIEWER_VOICES } = await import('../constant');
                const selectedVoiceId = useSettingStore.getState().voice;
                const selectedVoiceData = INTERVIEWER_VOICES.find(v => v.id === selectedVoiceId);
                
                if (selectedVoiceData) {
                    // Try to find the selected voice
                    selectedVoice = voices.find(voice => 
                        voice.name.includes(selectedVoiceData.voiceName) ||
                        voice.name.includes(selectedVoiceData.fallbackVoice)
                    );
                }
            } catch (error) {
                console.error('Could not load voice store, using default selection:', error);
            }
            
            // If selected voice not found, try fallback voices
            if (!selectedVoice) {
                const fallbackVoices = [
                    'Google UK English Female',
                    'Google UK English Male',
                    'Google US English Female',
                    'Google US English Male',
                    'Microsoft David - English (United States)',
                    'Microsoft Zira - English (United States)',
                    'Samantha',
                    'Alex',
                    'Daniel',
                    'Victoria',
                    'Natural',
                    'Enhanced'
                ];
                
                // Try to find a fallback voice
                for (const fallbackVoice of fallbackVoices) {
                    const voice = voices.find(v => 
                        v.name.includes(fallbackVoice) || 
                        v.name.toLowerCase().includes(fallbackVoice.toLowerCase())
                    );
                    if (voice) {
                        selectedVoice = voice;
                        break;
                    }
                }
            }
            
            // If still no good voice, use the first available
            if (!selectedVoice && voices.length > 0) {
                selectedVoice = voices[0];
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            utterance.onstart = () => {
                this.isSpeaking = true;
                if (this._onTTSStart) this._onTTSStart();
            };
            
            utterance.onend = () => {
                this.isSpeaking = false;
                if (this._onTTSEnd) this._onTTSEnd();
            };
            
            utterance.onerror = (event) => {
                this.isSpeaking = false;
                if (this._onTTSError) this._onTTSError(event.error);
            };
            
            this.synthesis.speak(utterance);
        } else {
            console.error('Speech synthesis not supported');
        }
    }

    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }

    isSupported() {
        return !!(this.recognition && this.synthesis);
    }

    getListeningState() {
        return this.isListening;
    }

    getSpeakingState() {
        return this.isSpeaking;
    }

    // Event handlers
    onSpeechResult(callback) {
        this._onSpeechResult = callback;
    }

    onSpeechError(callback) {
        this._onSpeechError = callback;
    }

    onSpeechStart(callback) {
        this._onSpeechStart = callback;
    }

    onSpeechEnd(callback) {
        this._onSpeechEnd = callback;
    }

    onTTSStart(callback) {
        this._onTTSStart = callback;
    }

    onTTSEnd(callback) {
        this._onTTSEnd = callback;
    }

    onTTSError(callback) {
        this._onTTSError = callback;
    }
}

export const speechManager = new SpeechManager();