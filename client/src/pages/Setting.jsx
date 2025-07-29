import { THEMES } from "../constant";
import { useSettingStore } from "../store/useSettingStore";
import { INTERVIEWER_VOICES } from "../constant";
import { motion } from 'framer-motion';
import { Palette, Settings as SettingsIcon, Mic, Volume2, User } from 'lucide-react';
import { speechManager } from '../lib/speech.js';


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.6,
    }
  },
  hover: {
    scale: 1.05,
    y: -3,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.2,
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6
    }
  }
};

const voiceCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.3,
    }
  },
  selected: {
    scale: 1.05,
    y: -8,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.3,
    }
  }
};

const Setting = () => {
    
    const {setTheme,setVoice,voice} = useSettingStore();
    
 
    
    const handleVoiceSelect = (voiceId) => {
      setVoice(voiceId);
    };
    
    
    const handleDemoPreview = () => {
      const selectedVoiceData = INTERVIEWER_VOICES.find(v => v.id === voice);
      if (!selectedVoiceData) {
        console.error('No voice data found for:', voice);
        return;
      }
      const demoText = `Hi there! I'm ${selectedVoiceData.name}, your AI interviewer. This is how I'll sound during your interview sessions.`;
      if (speechManager) {
        speechManager.speak(demoText);
      } else {
        console.error('Speech manager not available');
      }
    };
    
    
  return (
    <motion.div 
      className="min-h-screen container mx-auto px-4 pt-20 max-w-6xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Voice Selection */}
        <motion.div 
          className="space-y-6"
          variants={headerVariants}
        >
          <motion.div 
            className="flex flex-col gap-2"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-bold flex items-center gap-3"
              variants={itemVariants}
            >
              <Mic className="w-6 h-6 text-primary" />
              Interviewer Voice
            </motion.h2>
            <motion.p 
              className="text-base-content/70"
              variants={itemVariants}
            >
              Choose your preferred AI interviewer voice for a personalized experience
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {INTERVIEWER_VOICES.map((v, index) => (
              <motion.div 
                key={v.id}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                  ${voice === v.id 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-base-300 bg-base-100 hover:border-primary/50'
                  }
                `}
                variants={voiceCardVariants}
                whileHover="hover"
                whileTap="tap"
                animate={voice === v.id ? "selected" : "visible"}
                onClick={() => handleVoiceSelect(v.id)}
                transition={{ delay: index * 0.1 }}
              >
                {/* Selected indicator */}
                {voice === v.id && (
                  <motion.div 
                    className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    <User className="w-3 h-3 text-primary-content" />
                  </motion.div>
                )}
                
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Avatar */}
                  <motion.div 
                    className="text-3xl"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    {v.avatar}
                  </motion.div>
                  
                  {/* Name and Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-base-content">{v.name}</h3>
                    <p className="text-xs text-base-content/70">{v.description}</p>
                    <p className="text-xs text-primary font-medium">{v.accent} Accent</p>
                  </div>
                  
                  {/* Personality */}
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    {v.personality}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Demo Preview Section */}
          <motion.div 
            className="mt-6 p-4 bg-base-200 rounded-xl border border-base-300"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-base-content mb-2">Demo Preview</h3>
                <p className="text-sm text-base-content/70">
                  Hear how your selected interviewer will sound during an actual interview session
                </p>
              </div>
              <motion.button
                className="btn btn-primary btn-sm"
                onClick={handleDemoPreview}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Play Demo
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Theme Selection */}
        <motion.div 
          className="space-y-6 mb-8"
          variants={headerVariants}
        >
          <motion.div 
            className="flex flex-col gap-2"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl font-bold flex items-center gap-3"
              variants={itemVariants}
            >
              <Palette className="w-6 h-6 text-primary" />
              Theme
            </motion.h2>
            <motion.p 
              className="text-base-content/70"
              variants={itemVariants}
            >
              Choose a theme for your interface
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {THEMES.map((t, index) => (
              <motion.div 
                key={t} 
                data-theme={t} 
                className="w-full"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  className={`
                    group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                    hover:bg-base-200/50 w-full
                  `}
                  onClick={() => setTheme(t)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="relative h-8 w-full rounded-md overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                  >
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary"></div>
                      <div className="rounded bg-secondary"></div>
                      <div className="rounded bg-accent"></div>
                      <div className="rounded bg-neutral"></div>
                    </div>
                  </motion.div>
                  <motion.span 
                    className="text-[11px] font-medium truncate w-full text-center"
                    whileHover={{ color: "hsl(var(--p))" }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </motion.span>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
export default Setting;