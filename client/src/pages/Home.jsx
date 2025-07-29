import React from "react";
import { useModalStore } from "../store/useModalStore";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Footer from "../components/Footer";
import {
  Brain,
  MessageSquareText,
  LineChart,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Users,
} from "lucide-react"; // Importing icons from lucide-react
import { motion } from "framer-motion"; // Import motion from framer-motion

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children elements' animations
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.15, transition: { duration: 0.3 } },
};

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
};

const heroImageVariants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: [20, -10, 20], // For a gentle floating effect
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};


const features = [
  {
    icon: <Brain size={32} />, // Using Lucide icon
    title: "AI-Powered Questions",
    desc: "Get dynamic, domain-specific questions tailored to your experience level.",
  },
  {
    icon: <MessageSquareText size={32} />, // Using Lucide icon
    title: "Voice Interaction",
    desc: "Practice answering out loud and receive feedback on your communication skills.",
  },
  {
    icon: <LineChart size={32} />, // Using Lucide icon
    title: "Instant Feedback",
    desc: "Receive detailed, actionable feedback and scoring after every answer.",
  },
  {
    icon: <Globe size={32} />, // Using Lucide icon
    title: "Multiple Domains",
    desc: "Choose from tech, management, finance, and more for a personalized experience.",
  },
  {
    icon: <Lock size={32} />, // Using Lucide icon
    title: "Privacy First",
    desc: "Your data and responses are always secure and confidential.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    text: "The AI feedback is spot on! Helped me land my dream job. Highly recommended!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul M.",
    text: "Mock interviews feel incredibly real, and the instant tips are super helpful for quick improvements.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Aisha K.",
    text: "I absolutely love the voice interaction feature. My confidence in interviews has truly skyrocketed!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Home = () => {
  const { setOpenModal } = useModalStore();
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-br from-base-100 to-base-200 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-13 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Hero Text Content */}
          <motion.div
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-base-content leading-tight mb-6"
              variants={itemVariants}
              transition={{ duration: 0.6 }}
            >
              Crack Your Next Interview{" "}
              <span className="text-primary-focus inline-block transform -rotate-1 skew-y-1">
                with AI
              </span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-base-content/80 max-w-2xl mb-8"
              variants={itemVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience realistic, AI-powered mock interviews. Get instant,
              actionable feedback to boost your confidence and skills.
            </motion.p>

            {user ? (
              <motion.div
                variants={itemVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to={
                    user.interviewLeft === 0 && user.subscription !== "pro"
                      ? "/pricing"
                      : "/start"
                  }
                  className="group inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-primary-content text-lg font-semibold shadow-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
                >
                  Start Free Interview
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ) : (
              <motion.button
                type="button"
                onClick={setOpenModal}
                className="group inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary text-primary-content text-lg font-semibold shadow-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
                variants={itemVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Start Free Interview
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            )}

            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-5 mt-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6, staggerChildren: 0.15 }}
            >
              <motion.span
                className="inline-flex items-center px-4 py-2 bg-base-300 rounded-full text-sm font-medium text-base-content shadow-sm"
                variants={itemVariants}
              >
                <Lock className="w-4 h-4 mr-2 text-info" /> Privacy Protected
              </motion.span>
              <motion.span
                className="inline-flex items-center px-4 py-2 bg-base-300 rounded-full text-sm font-medium text-base-content shadow-sm"
                variants={itemVariants}
              >
                <Sparkles className="w-4 h-4 mr-2 text-warning" /> AI Powered
              </motion.span>
              <motion.span
                className="inline-flex items-center px-4 py-2 bg-base-300 rounded-full text-sm font-medium text-base-content shadow-sm"
                variants={itemVariants}
              >
                <Award className="w-4 h-4 mr-2 text-success" /> Expert Feedback
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <div
            className="flex-1 flex justify-center items-center relative z-0"

          >
            <img
              src="/aiAssistent.webp" // Updated image for a modern look
              alt="AI Interview Assistant"
              className="w-[400px] h-[400px] md:w-[550px] md:h-[550px] object-contain drop-shadow-2xl"
            />
            {/* Abstract shapes for visual interest - framer-motion can animate these too if desired */}
            {/* For simplicity and performance, keeping these static or using subtle CSS animation for background elements is also common */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob-slow animation-delay-2000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 bg-base-200/50" id="features">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-base-content mb-16 relative">
            Elevate Your Interview Skills
            <span className="block w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }} // Animate once when 30% of the element is in view
            variants={containerVariants}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="relative bg-base-100 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform group flex flex-col items-center text-center border border-base-300 overflow-hidden hover:-translate-y-2"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.span
                  className="feature-icon text-primary mb-5 block transition-transform duration-300 group-hover:scale-110"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  {f.icon}
                </motion.span>
                <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-base-content/70 text-sm leading-relaxed group-hover:text-base-content transition-colors duration-300">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action/Pricing Teaser */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-content py-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Users className="w-full h-full object-cover opacity-10" />
        </div>
        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Start Your Interview Journey for Free!
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Your initial interviews are on us. Unlock unlimited practice
            sessions and advanced features with our flexible plans.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              to="/pricing"
              className="inline-flex items-center px-10 py-4 rounded-full bg-base-100 text-primary font-bold text-lg shadow-xl hover:bg-base-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              View Pricing Plans
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-10 bg-base-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-base-content mb-16 relative">
            What Our Users Say
            <span className="block w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></span>
          </h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="bg-base-200 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transform transition-transform duration-300 border border-base-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mb-5 border-4 border-primary shadow-lg object-cover"
                />
                <p className="text-base-content text-lg mb-4 italic leading-relaxed">
                  "{t.text}"
                </p>
                <span className="font-bold text-primary text-xl">
                  - {t.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;