import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useModalStore } from "../store/useModalStore";


const About = () => {
  const {user} = useAuthStore();
  const {setOpenModal} = useModalStore();
  return (
    <div className="min-h-[120vh] bg-base-200 flex items-center justify-center">
      <div className="pt-4 flex justify-center w-full">
        <div className="w-full max-w-5xl bg-base-100 rounded-3xl shadow-2xl p-12 border-2 border-primary transition-shadow duration-200 hover:shadow-[0_0_40px_10px_var(--tw-shadow-color,theme(colors.primary/0.3))] hover:cursor-pointer">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-base-content mb-2">About AI Interview</h1>
            <p className="text-lg text-primary font-medium">Transforming Your Interview Journey with AI</p>
          </div>

          {/* Mission */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-base-content mb-2">Our Mission</h2>
            <p className="text-base-content/70">We aim to revolutionize the way candidates prepare for technical interviews by providing an AI-powered platform that simulates real interview experiences. Our goal is to help you build confidence and excel in your interviews.</p>
          </div>

          {/* Why Choose Us */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-base-content mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-base-200 rounded-lg p-6 text-center border border-primary transition-transform duration-200 shadow-md hover:shadow-primary/40 hover:scale-105">
                <h3 className="font-semibold text-base-content mb-1">AI-Powered Interviews</h3>
                <p className="text-base-content/70 text-sm">Experience realistic interview scenarios with our advanced AI technology</p>
              </div>
              <div className="bg-base-200 rounded-lg p-6 text-center border border-primary transition-transform duration-200 shadow-md hover:shadow-primary/40 hover:scale-105">
                <h3 className="font-semibold text-base-content mb-1">Instant Feedback</h3>
                <p className="text-base-content/70 text-sm">Get immediate, constructive feedback on your performance</p>
              </div>
              <div className="bg-base-200 rounded-lg p-6 text-center border border-primary transition-transform duration-200 shadow-md hover:shadow-primary/40 hover:scale-105">
                <h3 className="font-semibold text-base-content mb-1">Track Progress</h3>
                <p className="text-base-content/70 text-sm">Monitor your improvement over time with detailed analytics</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-base-content mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-xl mb-2">1</span>
                <h3 className="font-semibold text-base-content mb-1">Sign Up</h3>
                <p className="text-base-content/70 text-sm text-center">Create your account and set up your profile</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-xl mb-2">2</span>
                <h3 className="font-semibold text-base-content mb-1">Select Interview</h3>
                <p className="text-base-content/70 text-sm text-center">Choose from various technical interview scenarios</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-xl mb-2">3</span>
                <h3 className="font-semibold text-base-content mb-1">Practice</h3>
                <p className="text-base-content/70 text-sm text-center">Engage in realistic mock interviews with AI</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-content font-bold text-xl mb-2">4</span>
                <h3 className="font-semibold text-base-content mb-1">Review</h3>
                <p className="text-base-content/70 text-sm text-center">Get detailed feedback and improve</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-14">
            <h2 className="text-3xl font-bold text-base-content mb-2">Ready to Start?</h2>
            <p className="text-base-content/70 mb-6">Join thousands of successful candidates who have improved their interview skills with AI Interview</p>
            {user ? (

              <Link to="/start" className="bg-primary text-primary-content px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-primary-focus transition inline-block">Get Started</Link>
            ):
            (
              <button onClick={setOpenModal} className="bg-primary text-primary-content px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-primary-focus transition inline-block">Get Started</button>

            )}
          </div>
        </div>
      </div>
      <div className="h-32" />
    </div>
  );
};

export default About; 