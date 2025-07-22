import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; 
import Modal from "../components/Modal";
import { useModalStore } from "../store/useModalStore";
import { usePaymentStore } from "../store/usePaymentStore";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";


const comparisonRows = [
  ["AI-Powered Interviews", "1", "2", "Unlimited (1 month)"],
  ["Feedback Quality", "Basic", "Advanced", "Advanced"],
  ["Voice Analysis", "-", "✔", "✔"],
  ["Progress Tracking", "-", "-", "✔"],
  ["Support", "Email", "Priority", "Dedicated"],
];

const faqs = [
  {
    q: "Can I try AI Interviewer for free?",
    a: "Yes! You get 1 free interview when you sign up. No credit card required.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards and PayPal for Pro and Team plans.",
  },
  {
    q: "Can I cancel or change my plan anytime?",
    a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your account settings.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, your privacy and data security are our top priorities. We use industry-standard encryption and never share your data.",
  },
  {
    q: "Do you offer discounts for students or non-profits?",
    a: "Yes! Please contact us for special pricing if you are a student or represent a non-profit organization.",
  },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useAuthStore(); // Get user data from store
  const {setOpenModal} = useModalStore();
  const {isFreeClaimed,claimFree,processPayment,isCheckoutLoading,getKey} = usePaymentStore();

  
  const handleCheckout = async (plan)=>{
    if(!user){
      setOpenModal();
    }
    if(user.subscription === 'pro'){
      toast.error("You are already on the Pro plan");
      return;
    }
    if(plan === 'free'){
      await claimFree();
      return;
    }
    let amount = 0;
    if(plan === 'starter'){ 
      amount = 79;
    }
    if(plan === 'pro'){
      amount = 499;
    }
    const {key} = await getKey();
    const {order} = await processPayment({
      amount,
      plan,
    });


    const options = {
      key,
      amount:order.amount,
      currency: 'INR',
      name:'AI Interview',
      description: 'payment for interview subscription',
      order_id: order.id, // This is the order_id created in the backend
      callback_url:import.meta.env.VITE_BACKEND_URL + '/api/payment/paymentVerification', // Your success URL
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone
      },
      theme: {
        color: '#F37254'
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero */}
      <section className="pricing-hero text-center py-16 px-4 bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Start for free. Upgrade anytime for unlimited, AI-powered interview
          practice and feedback.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section className="pricing-tiers flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-6xl mx-auto py-16 px-4">
        {/* Free Tier */}
        <div className="tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-base-200 transition-transform duration-300 hover:scale-105">
          <div className="tier-title text-2xl font-bold mb-2 text-primary">Free</div>
          <div className="tier-price text-4xl font-extrabold mb-1 text-base-content">₹0</div>
          <div className="tier-desc text-base-content/70 mb-4 text-center">Get started with 1 free interviews</div>
          <ul className="mb-6 space-y-2 w-full">
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> 1 AI-powered interviews</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Basic feedback</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Email support</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> validity 1 month</li>
          </ul>
          {(user?.freeInterview === 'claimed' || isFreeClaimed) ? (
            <div className="w-full flex flex-col items-center">
              <button
                disabled
                className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-gradient-to-r from-green-400 to-green-600 text-white cursor-not-allowed border-2 border-green-500 opacity-90"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Claimed
                </span>
              </button>
            </div>
          ) : (
            <button
              disabled={isCheckoutLoading}
              onClick={() => handleCheckout('free')}
              className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-base-100 text-primary border border-primary hover:bg-base-200"
            >
              <span className="flex items-center justify-center w-full">
                {isCheckoutLoading ? <Loader className="size-4 animate-spin" /> : 'Start Free'}
              </span>
            </button>
          )}
        </div>
        {/* Starter Tier */}
        <div className={`tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border transition-transform duration-300 hover:scale-105 z-10 ${user?.subscription === 'starter' ? 'border-green-500 border-4' : 'border-base-200'}`}>
          {/* Active badge if user has starter subscription */}
          {user?.subscription === 'starter' && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider z-20">Active</div>
          )}
          <div className="tier-title text-2xl font-bold mb-2 text-primary">Starter</div>
          <div className="tier-price text-4xl font-extrabold mb-1 text-base-content">₹79</div>
          <div className="tier-desc text-base-content/70 mb-4 text-center">2 interviews & advanced feedback</div>
          <ul className="mb-6 space-y-2 w-full">
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> 2 AI-powered interviews</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Advanced AI feedback</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Voice analysis</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Priority support</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Validity 1 month</li>
          </ul>
          <button
            disabled={isCheckoutLoading}
            onClick={() => handleCheckout('starter')}
            className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-primary text-primary-content hover:bg-primary-focus"
          >
            <span className="flex items-center justify-center w-full">
              {isCheckoutLoading ? <Loader className="size-4 animate-spin" /> : 'Get Starter'}
            </span>
          </button>
        </div>
        {/* Pro Tier */}
        <div className={`tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border transition-transform duration-300 hover:scale-105 ${user?.subscription === 'pro' ? 'border-green-500 border-4' : 'border-base-200'}`}>
          {/* Active badge if user has pro subscription */}
          {user?.subscription === 'pro' && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider z-20">Active</div>
          )}
          <div className="tier-title text-2xl font-bold mb-2 text-primary">Pro</div>
          <div className="tier-price text-4xl font-extrabold mb-1 text-base-content">₹499<span className="text-base font-medium text-base-content/70">/month</span></div>
          <div className="tier-desc text-base-content/70 mb-4 text-center">1 month unlimited interviews</div>
          <ul className="mb-6 space-y-2 w-full">
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Unlimited interviews (1 month)</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Advanced AI feedback</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Voice analysis</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Progress tracking</li>
            <li className="flex items-center gap-2 text-base-content"><span className="text-primary">✔</span> Dedicated support</li>
          </ul>
          <button
            disabled={isCheckoutLoading}
            onClick={() => handleCheckout('pro')}
            className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-base-100 text-primary border border-primary hover:bg-base-200"
          >
            <span className="flex items-center justify-center w-full">
              {isCheckoutLoading ? <Loader className="size-4 animate-spin" /> : 'Go Pro'}
            </span>
          </button>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-table max-w-4xl mx-auto my-16 px-2">
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-base-100/80">
          <table className="min-w-full text-center text-base-content">
            <thead>
              <tr className="bg-base-200">
                <th className="py-3 px-4 text-lg font-bold">Features</th>
                <th className="py-3 px-4 text-lg font-bold">Free</th>
                <th className="py-3 px-4 text-lg font-bold">Starter</th>
                <th className="py-3 px-4 text-lg font-bold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-base-200 hover:bg-base-200 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-left md:text-center">
                    {row[0]}
                  </td>
                  <td className="py-3 px-4">{row[1]}</td>
                  <td className="py-3 px-4">{row[2]}</td>
                  <td className="py-3 px-4">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-base-content mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq rounded-xl bg-base-100/70 shadow p-5">
              <button
                className="faq-question w-full text-left flex justify-between items-center text-lg font-semibold text-primary focus:outline-none"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                {faq.q}
                <span
                  className={`ml-2 transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`faq-answer overflow-hidden transition-all duration-500 text-base-content ${
                  openFaq === idx
                    ? "max-h-40 mt-3 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
                style={{}}
              >
                {openFaq === idx && <div>{faq.a}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 px-4">
        <div className="inline-block bg-gradient-to-r from-primary to-secondary text-primary-content px-10 py-6 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
          <p className="mb-4">
            Sign up now and get your first interview free. No credit card required.
          </p>
          {user?.freeInterview === 'Claimed' ? (
              <button
                disabled
              className="px-8 py-3 rounded-lg bg-gray-300 text-gray-500 font-semibold text-lg cursor-not-allowed"
              >
              Claimed
              </button>
            ) : (
            <a
              href="#"
              className="px-8 py-3 rounded-lg bg-base-100 text-primary font-semibold text-lg shadow hover:bg-base-200 transition-colors duration-200"
            >
              Start Free
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default Pricing;