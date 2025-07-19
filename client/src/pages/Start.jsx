import React, { useState } from 'react';
import { Mic, Zap, Computer, Building, DollarSign, Settings, Heart, Scale, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';
import toast from 'react-hot-toast';
import UpdateProfileModal from '../components/UpdateProfileModal';

const categories = [
  { id: 'tech', label: 'Tech & Programming', icon: Computer },
  { id: 'upsc', label: 'UPSC & Government', icon: Building },
  { id: 'business', label: 'Business & Finance', icon: DollarSign },
  { id: 'engineering', label: 'Engineering', icon: Settings },
  { id: 'medical', label: 'Medical & Healthcare', icon: Heart },
  { id: 'law', label: 'Law & Legal', icon: Scale },
  { id: 'data', label: 'Data Science & AI', icon: BarChart3 },
  { id: 'marketing', label: 'Marketing & Sales', icon: TrendingUp }
];

// Map categories to topics and subtopics
const categoryTopics = {
  tech: { topic: 'Tech & Programming', subtopic: 'Web Development' },
  upsc: { topic: 'UPSC & Government', subtopic: 'General Studies' },
  business: { topic: 'Business & Finance', subtopic: 'Entrepreneurship' },
  engineering: { topic: 'Engineering', subtopic: 'Mechanical Engineering' },
  medical: { topic: 'Medical & Healthcare', subtopic: 'Pharmacology' },
  law: { topic: 'Law & Legal', subtopic: 'Constitutional Law' },
  data: { topic: 'Data Science & AI', subtopic: 'Machine Learning' },
  marketing: { topic: 'Marketing & Sales', subtopic: 'Digital Marketing' },
};

const Start = () => {
  const { user } = useAuthStore();
  const { setOpenModal } = useModalStore();
  const navigate = useNavigate();

  // State for topic and subtopic
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  // Resume toggle and modal
  const [includeResume, setIncludeResume] = useState(!!(user && user.resume && user.resume.endsWith('.pdf')));
  const [showResumeModal, setShowResumeModal] = useState(false);

  const handleStartClick = () => {
    if (!user) {
      setOpenModal(); 
      return;
    }
    if(user.interviewLeft==0){
      toast.error("You don't have credits")
      navigate('/pricing')
      return;
    }
    navigate('/interview/id=1234');
  };

  // Autofill topic/subtopic on category click
  const handleCategoryClick = (categoryId) => {
    const cat = categoryTopics[categoryId];
    if (cat) {
      setTopic(cat.topic);
      setSubtopic(cat.subtopic);
    }
  };

  // Generate random topic/subtopic
  const handleRandomTopic = () => {
    const keys = Object.keys(categoryTopics);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const cat = categoryTopics[randomKey];
    setTopic(cat.topic);
    setSubtopic(cat.subtopic);
  };

  // Handle resume toggle
  const handleResumeToggle = () => {
    if (includeResume) {
      setIncludeResume(false);
    } else {
      if (user && user.resume && user.resume.endsWith('.pdf')) {
        setIncludeResume(true);
      } else {
        toast("Add your resume")
        setShowResumeModal(true);
      }
    }
  };

  // When resume is uploaded, turn toggle ON
  const handleResumeModalClose = () => {
    setShowResumeModal(false);
    if (user && user.resume && user.resume.endsWith('.pdf')) {
      setIncludeResume(true);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 font-inter">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">Choose Your Topic</h2>
          <p className="text-base-content/70 text-lg">
            Select trending categories or specify your own topic for AI-generated interview questions
          </p>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl p-8 space-y-8">
          {/* Popular Categories */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-6">Popular Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="p-4 rounded-xl border-2 border-base-200 bg-base-200 text-primary text-left shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium text-base-content">{category.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resume Option - improved and moved below categories */}
          <div className="rounded-xl border border-primary/30 bg-base-200 p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="font-bold text-lg flex items-center gap-2 text-primary">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87" /></svg>
                Resume for Interview
              </span>
              {user && user.resume && user.resume.endsWith('.pdf') ? (
                <div className="flex items-center gap-2 mt-1">
                  <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">View Resume</a>
                  <span className="badge badge-success text-xs font-semibold">Uploaded</span>
                </div>
              ) : (
                <span className="text-base-content/70 text-sm mt-1">No resume uploaded. Upload to include in your interview.</span>
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <input
                type="checkbox"
                className="toggle toggle-lg toggle-primary"
                checked={includeResume}
                onChange={handleResumeToggle}
                id="resume-toggle"
              />
              <label htmlFor="resume-toggle" className="text-xs text-base-content/70">{includeResume ? 'Included' : 'Not Included'}</label>
              {includeResume && !(user && user.resume && user.resume.endsWith('.pdf')) && (
                <span className="text-error text-xs mt-1">Please upload your resume to enable this option.</span>
              )}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-4">Specify Your Topic</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Type your topic..."
                className="w-full px-4 py-4 border border-base-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content bg-base-100"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
          </div>

          {/* Subtopic Input */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-4">Add Subtopic (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., Computer Networks, DBMS, Algorithms..."
              className="w-full px-4 py-4 border border-base-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content bg-base-100"
              value={subtopic}
              onChange={e => setSubtopic(e.target.value)}
            />
          </div>

          {/* Random Topic Section */}
          <button
            className="w-full bg-gradient-to-r from-primary to-secondary text-primary-content py-3 px-6 rounded-lg font-medium hover:from-primary-focus hover:to-secondary-focus transition-all duration-200 flex items-center justify-center gap-2"
            onClick={handleRandomTopic}
          >
            <Zap className="w-5 h-5" />
            Generate Random Topic
          </button>

          {/* ✅ Start Interview Button */}
          <button
            onClick={handleStartClick}
            className="w-full bg-gradient-to-r from-accent to-primary text-primary-content py-4 px-8 rounded-xl font-semibold text-lg hover:from-accent-focus hover:to-primary-focus transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Interview
          </button>
        </div>
      </section>
      <UpdateProfileModal open={showResumeModal} onClose={handleResumeModalClose} />
    </div>
  );
};

export default Start;
