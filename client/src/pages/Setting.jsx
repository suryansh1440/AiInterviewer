import { THEMES } from "../constant";
import { useThemeStore } from "../store/useThemeStore";
import { motion } from 'framer-motion';
import { Palette, Settings as SettingsIcon } from 'lucide-react';

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

const themeCardVariants = {
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

const Setting = () => {
    
    const {setTheme} = useThemeStore();
  return (
    <motion.div 
      className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Theme Selection */}
        <motion.div 
          className="flex flex-col gap-1"
          variants={headerVariants}
        >
          <motion.h2 
            className="text-lg font-semibold flex items-center gap-2"
            variants={itemVariants}
          >
            <Palette className="w-5 h-5 text-primary" />
            Theme
          </motion.h2>
          <motion.p 
            className="text-sm text-base-content/70"
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
              variants={themeCardVariants}
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
  );
};
export default Setting;