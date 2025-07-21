import React from "react";
import { useModalStore } from "../store/useModalStore";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Questions",
    desc: "Get dynamic, domain-specific questions tailored to your experience level.",
  },
  {
    icon: "🗣️",
    title: "Voice Interaction",
    desc: "Practice answering out loud and receive feedback on your communication skills.",
  },
  {
    icon: "📊",
    title: "Instant Feedback",
    desc: "Receive detailed, actionable feedback and scoring after every answer.",
  },
  {
    icon: "🌐",
    title: "Multiple Domains",
    desc: "Choose from tech, management, finance, and more for a personalized experience.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your data and responses are always secure and confidential.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    text: "The AI feedback is spot on! Helped me land my dream job.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul M.",
    text: "Mock interviews feel real and the instant tips are super helpful.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Aisha K.",
    text: "Love the voice interaction feature. My confidence has skyrocketed!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Home = () => {
  const { setOpenModal } = useModalStore();
  const { user } = useAuthStore();
  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <section className="hero flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 gap-10">
        <div className="hero-text flex-1 flex flex-col items-start gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content leading-tight">
            Crack Your Next Interview{" "}
            <span className="text-primary">with AI</span>
          </h1>
          <p className="subtitle text-lg md:text-xl text-base-content/70">
            Experience realistic, AI-powered mock interviews.
            <br />
            Get instant, actionable feedback to boost your confidence and
            skills.
          </p>
          {user ? (
            <Link
              to={user.interviewLeft==0 && user.subscription!=='pro' ? "/pricing" : "/start"}
              className="cta-btn mt-2 px-8 py-3 rounded-lg bg-primary text-primary-content text-lg font-semibold shadow-lg hover:bg-primary-focus transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Start Free Interview
            </Link>
          ) : (
            <button
              type="button"
              onClick={setOpenModal}
              className="cta-btn mt-2 px-8 py-3 rounded-lg bg-primary text-primary-content text-lg font-semibold shadow-lg hover:bg-primary-focus transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Start Free Interview
            </button>
          )}

          <div className="flex gap-4 mt-4">
            <img
              src="https://img.shields.io/badge/Privacy%20Protected-100%25-blue"
              alt="Privacy Badge"
              className="h-7"
            />
            <img
              src="https://img.shields.io/badge/AI%20Powered-Yes-blueviolet"
              alt="AI Badge"
              className="h-7"
            />
          </div>
        </div>
        <div className="hero-img flex-1 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4341/4341025.png"
            alt="AI Interview"
            className="w-80 h-80 object-contain drop-shadow-2xl animate-float"
          />
        </div>
      </section>

      {/* Features Section */}

      <section className="features bg-base-100 py-16 px-4" id="features">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-base-content mb-10">
          Platform Features
        </h2>
        <div className="features-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature flex flex-col items-center bg-base-200 rounded-xl p-6 shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-200 group"
            >
              <span className="feature-icon text-4xl mb-3 group-hover:scale-125 transition-transform text-primary">
                {f.icon}
              </span>
              <h3 className="text-xl font-semibold text-base-content mb-2 text-center">
                {f.title}
              </h3>
              <p className="text-base-content/70 text-center text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="pricing-teaser bg-gradient-to-r from-primary to-secondary text-primary-content py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Free</h2>
        <p className="text-lg md:text-xl mb-6">
          Your first 2 interviews are on us.
          <br />
          Subscribe anytime to unlock unlimited practice sessions.
        </p>
        <Link
          to="/pricing"
          className="subscribe-btn inline-block px-8 py-3 rounded-lg bg-base-100 text-primary font-semibold text-lg shadow hover:bg-base-200 transition-colors duration-200"
        >
          View Pricing
        </Link>
      </section>

      {/* Testimonials */}

      <section className="testimonials py-16 px-4 bg-base-100">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-base-content mb-10">
          What Our Users Say
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-base-200 rounded-xl shadow p-6 flex flex-col items-center w-full md:w-80 hover:shadow-lg transition-shadow"
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="w-16 h-16 rounded-full mb-3 border-4 border-base-100 shadow"
              />
              <p className="text-base-content text-center mb-2">"{t.text}"</p>
              <span className="font-semibold text-primary">{t.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
