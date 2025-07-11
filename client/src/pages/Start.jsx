import React from 'react';
import { Mic, Zap, Computer, Building, DollarSign, Settings, Heart, Scale, BarChart3, TrendingUp } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 font-inter">
      {/* Topic Selection Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Topic</h2>
          <p className="text-gray-600 text-lg">Select trending categories or specify your own topic for AI-generated interview questions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Popular Categories */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Popular Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id} className="p-4 rounded-xl border-2 border-gray-200 bg-red-50 text-red-700 text-left shadow hover:shadow-lg transition-all duration-200">
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Specify Your Topic</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Type your topic..."
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-700"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-all"
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Subtopic Input */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Subtopic (Optional)</h3>
            <input
              type="text"
              placeholder="e.g., Computer Networks, DBMS, Algorithms..."
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 text-gray-700"
            />
          </div>

          {/* Random Topic Section (STATIC) */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
            <p className="text-gray-700 mb-4 font-medium">Let AI pick a random topic from your field of study</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your field/domain (e.g., CSE, Mechanical, MBA, UPSC)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-gray-700"
              />
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 transition-all duration-200 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Generate Random Topic
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Interview
          </button>
        </div>
      </section>
    </div>
  );
};

export default Start;
