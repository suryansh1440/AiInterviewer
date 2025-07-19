import React from 'react';
import { Mic, Zap, Computer, Building, DollarSign, Settings, Heart, Scale, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useModalStore } from '../store/useModalStore';
import toast from 'react-hot-toast';

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

const Start = () => {
  const { user } = useAuthStore();
  const { setOpenModal } = useModalStore();
  const navigate = useNavigate();

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
                    className="p-4 rounded-xl border-2 border-base-200 bg-base-200 text-primary text-left shadow hover:shadow-lg transition-all duration-200"
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium text-base-content">{category.label}</span>
                  </div>
                );
              })}
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
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full hover:bg-primary-focus transition-all">
                <Mic className="w-5 h-5 text-primary-content" />
              </button>
            </div>
          </div>

          {/* Subtopic Input */}
          <div>
            <h3 className="text-xl font-semibold text-base-content mb-4">Add Subtopic (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., Computer Networks, DBMS, Algorithms..."
              className="w-full px-4 py-4 border border-base-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content bg-base-100"
            />
          </div>

          {/* Random Topic Section */}
          <div className="bg-base-200 rounded-xl p-6 border border-primary/20">
            <p className="text-base-content mb-4 font-medium">Let AI pick a random topic from your field of study</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your field/domain (e.g., CSE, Mechanical, MBA, UPSC)"
                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content bg-base-100"
              />
              <button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-content py-3 px-6 rounded-lg font-medium hover:from-primary-focus hover:to-secondary-focus transition-all duration-200 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Generate Random Topic
              </button>
            </div>
          </div>

          {/* ✅ Start Interview Button */}
          <button
            onClick={handleStartClick}
            className="w-full bg-gradient-to-r from-accent to-primary text-primary-content py-4 px-8 rounded-xl font-semibold text-lg hover:from-accent-focus hover:to-primary-focus transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Interview
          </button>
        </div>
      </section>
    </div>
  );
};

export default Start;
