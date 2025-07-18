import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; 
import Modal from "../components/Modal";
import { useModalStore } from "../store/useModalStore";

const pricingTiers = [
  {
    title: "Free",
    price: "₹0",
    priceNote: "",
    desc: "Get started with 2 free interviews",
    features: [
      "2 AI-powered interviews",
      "Basic feedback",
      "Access to all domains",
      "Email support",
    ],
    cta: "Start Free",
    ctaLink: "#",
    highlight: false,
  },
  {
    title: "Starter",
    price: "₹49",
    priceNote: "",
    desc: "5 interviews & advanced feedback",
    features: [
      "5 AI-powered interviews",
      "Advanced AI feedback",
      "Voice analysis",
      "Access to all domains",
      "Priority support",
    ],
    cta: "Get Starter",
    ctaLink: "#",
    highlight: true,
    badge: "Best Value",
  },
  {
    title: "Pro",
    price: "₹149",
    priceNote: "/month",
    desc: "1 month unlimited interviews",
    features: [
      "Unlimited interviews (1 month)",
      "Advanced AI feedback",
      "Voice analysis",
      "Progress tracking",
      "Dedicated support",
    ],
    cta: "Go Pro",
    ctaLink: "#",
    highlight: false,
  },
];

const comparisonRows = [
  ["AI-Powered Interviews", "2", "5", "Unlimited (1 month)"],
  ["Feedback Quality", "Basic", "Advanced", "Advanced"],
  ["Voice Analysis", "-", "✔", "✔"],
  ["Progress Tracking", "-", "-", "✔"],
  ["Team Management", "-", "-", "-"],
  ["Support", "Email", "Priority", "Dedicated"],
];

const faqs = [
  {
    q: "Can I try AI Interviewer for free?",
    a: "Yes! You get 2 free interviews when you sign up. No credit card required.",
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

  const handleSubmitPricing = (title)=>{
    if(!user){
      setOpenModal();
    }
    return;
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
        {pricingTiers.map((tier, idx) => (
            <div
              key={tier.title}
              className={`tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-base-200 transition-transform duration-300 hover:scale-105 ${
                tier.highlight ? "z-10 shadow-2xl border-primary" : ""
              }`}
            >
              {tier.badge && (
                <div className="popular-badge absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-content text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
                  {tier.badge}
                </div>
              )}
              <div className="tier-title text-2xl font-bold mb-2 text-primary">
                {tier.title}
              </div>
              <div className="tier-price text-4xl font-extrabold mb-1 text-base-content">
                {tier.price}
                <span className="text-base font-medium text-base-content/70">
                  {tier.priceNote}
                </span>
              </div>
              <div className="tier-desc text-base-content/70 mb-4 text-center">
                {tier.desc}
              </div>
              <ul className="mb-6 space-y-2 w-full">
                {tier.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-base-content"
                  >
                    <span className="text-primary">✔</span> {f}
                  </li>
                ))}
              </ul>
            {tier.title === 'Free' && user?.freeInterview === 'claimed' ? (
                <button
                  disabled
                className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                Claimed
                </button>
              ) : (
              <button
                onClick={() => handleSubmitPricing(tier.title)}
                className={`w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 ${
                  tier.highlight
                    ? "bg-primary text-primary-content hover:bg-primary-focus"
                    : "bg-base-100 text-primary border border-primary hover:bg-base-200"
                }`}
                >
                {tier.cta}
              </button>
              )}
            </div>
        ))}
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
            Sign up now and get your first 2 interviews free. No credit card required.
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