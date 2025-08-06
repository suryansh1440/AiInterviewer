import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; 
import Modal from "../components/Modal";
import { useModalStore } from "../store/useModalStore";
import { usePaymentStore } from "../store/usePaymentStore";
import toast from "react-hot-toast";
import { Loader, Check, Star, Zap, Crown } from "lucide-react";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
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
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.3,
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

const faqVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const comparisonRows = [
  ["AI-Powered Interviews", "2", "5", "Unlimited (1 month)"],
  ["Feedback Quality", "Basic", "Advanced", "Advanced"],
  ["Voice Analysis", "-", "✔", "✔"],
  ["Progress Tracking", "-", "-", "✔"],
  ["Support", "Email", "Priority", "Dedicated"],
];

const faqs = [
  {
    q: "Can I try AI Interviewer for free?",
    a: "Yes! You get 2 free interview when you sign up. No credit card required.",
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
      amount = 20;
    }
    if(plan === 'pro'){
      amount = 149;
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
      <motion.section 
        className="pricing-hero text-center py-16 px-4 bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
          variants={itemVariants}
        >
          Simple, Transparent Pricing
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl max-w-2xl mx-auto opacity-90"
          variants={itemVariants}
        >
          Start for free. Upgrade anytime for unlimited, AI-powered interview
          practice and feedback.
        </motion.p>
      </motion.section>

      {/* Pricing Tiers */}
      <motion.section 
        className="pricing-tiers flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-6xl mx-auto py-16 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Free Tier */}
        <motion.div 
          className="tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-base-200"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="tier-title text-2xl font-bold mb-2 text-primary flex items-center gap-2">
            <Star className="w-6 h-6" />
            Free
          </div>
          <div className="tier-price text-4xl font-extrabold mb-1 text-base-content">₹0</div>
          <div className="tier-desc text-base-content/70 mb-4 text-center">Get started with 2 free interviews</div>
          <ul className="mb-6 space-y-2 w-full">
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> 2 AI-powered interviews</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Basic feedback</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Email support</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> validity 1 month</li>
          </ul>
          {(user?.freeInterview === 'claimed' || isFreeClaimed) ? (
            <div className="w-full flex flex-col items-center">
              <motion.button
                disabled
                className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-gradient-to-r from-green-400 to-green-600 text-white cursor-not-allowed border-2 border-green-500 opacity-90"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-white" />
                  Claimed
                </span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              disabled={isCheckoutLoading}
              onClick={() => handleCheckout('free')}
              className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-base-100 text-primary border border-primary hover:bg-base-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center w-full">
                {isCheckoutLoading ? <Loader className="size-4 animate-spin" /> : 'Start Free'}
              </span>
            </motion.button>
          )}
        </motion.div>
        
        {/* Starter Tier */}
        <motion.div 
          className={`tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border z-10 ${user?.subscription === 'starter' ? 'border-green-500 border-4' : 'border-base-200'}`}
          variants={cardVariants}
          whileHover="hover"
        >
          {/* Active badge if user has starter subscription */}
          {user?.subscription === 'starter' && (
            <motion.div 
              className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              Active
            </motion.div>
          )}
          <div className="tier-title text-2xl font-bold mb-2 text-primary flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Starter
          </div>
          <div className="mb-1 flex flex-col items-center">
            <span className="text-xs font-semibold text-red-500 mb-1 bg-red-100 px-2 py-0.5 rounded-full">Limited Time Offer</span>
            <span className="line-through text-base-content/50 text-lg">₹50</span>
            <span className="tier-price text-4xl font-extrabold text-base-content">₹20</span>
          </div>
          <div className="tier-desc text-base-content/70 mb-4 text-center">5 interviews & advanced feedback</div>
          <ul className="mb-6 space-y-2 w-full">
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> 5 AI-powered interviews</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Advanced AI feedback</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Voice analysis</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Priority support</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Validity 1 month</li>
          </ul>
          <motion.button
            disabled={isCheckoutLoading}
            onClick={() => handleCheckout('starter')}
            className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-primary text-primary-content hover:bg-primary-focus"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center w-full">
              {isCheckoutLoading ? <Loader className="size-4 animate-spin" /> : 'Get Starter'}
            </span>
          </motion.button>
        </motion.div>
        
        {/* Pro Tier */}
        <motion.div 
          className={`tier relative flex-1 flex flex-col items-center bg-base-100/60 backdrop-blur-lg rounded-3xl shadow-xl p-8 border ${user?.subscription === 'pro' ? 'border-green-500 border-4' : 'border-base-200'}`}
          variants={cardVariants}
          whileHover="hover"
        >
          {/* Active badge if user has pro subscription */}
          {user?.subscription === 'pro' && (
            <motion.div 
              className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              Active
            </motion.div>
          )}
          <div className="tier-title text-2xl font-bold mb-2 text-primary flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Pro
          </div>
          <div className="mb-1 flex flex-col items-center">
            <span className="text-xs font-semibold text-red-500 mb-1 bg-red-100 px-2 py-0.5 rounded-full">Limited Time Offer</span>
            <span className="line-through text-base-content/50 text-lg">₹300</span>
            <span className="tier-price text-4xl font-extrabold text-base-content">₹149<span className="text-base font-medium text-base-content/70">/month</span></span>
          </div>
          <div className="tier-desc text-base-content/70 mb-4 text-center">1 month unlimited interviews</div>
          <ul className="mb-6 space-y-2 w-full">
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Unlimited interviews (1 month)</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Advanced AI feedback</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Voice analysis</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Progress tracking</li>
            <li className="flex items-center gap-2 text-base-content"><Check className="w-4 h-4 text-primary" /> Dedicated support</li>
          </ul>
          <motion.button
            disabled={isCheckoutLoading}
            onClick={() => handleCheckout('pro')}
            className="w-full text-center px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 bg-base-100 text-primary border border-primary hover:bg-base-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center w-full">
              {isCheckoutLoading ? <Loader className="size-4 animate-spin" /> : 'Go Pro'}
            </span>
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Comparison Table */}
      <motion.section 
        className="comparison-table max-w-4xl mx-auto my-16 px-2"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="overflow-x-auto rounded-2xl shadow-lg bg-base-100/80"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <table className="min-w-full text-center text-base-content">
            <thead>
              <motion.tr 
                className="bg-base-200"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <th className="py-3 px-4 text-lg font-bold">Features</th>
                <th className="py-3 px-4 text-lg font-bold">Free</th>
                <th className="py-3 px-4 text-lg font-bold">Starter</th>
                <th className="py-3 px-4 text-lg font-bold">Pro</th>
              </motion.tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <motion.tr
                  key={i}
                  className="border-t border-base-200 hover:bg-base-200 transition-colors"
                  variants={tableRowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  transition={{ delay: i * 0.1 }}
                >
                  <td className="py-3 px-4 font-semibold text-left md:text-center">
                    {row[0]}
                  </td>
                  <td className="py-3 px-4">{row[1]}</td>
                  <td className="py-3 px-4">{row[2]}</td>
                  <td className="py-3 px-4">{row[3]}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="faq-section max-w-3xl mx-auto py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center text-base-content mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className="faq rounded-xl bg-base-100/70 shadow p-5"
              variants={faqVariants}
              custom={idx}
              whileHover={{ scale: 1.02 }}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.button
                className="faq-question w-full text-left flex justify-between items-center text-lg font-semibold text-primary focus:outline-none"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {faq.q}
                <motion.span
                  className="ml-2 transition-transform"
                  animate={{ rotate: openFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </motion.button>
              <motion.div
                className="faq-answer overflow-hidden text-base-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: openFaq === idx ? "auto" : 0,
                  opacity: openFaq === idx ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="text-center py-12 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="inline-block bg-gradient-to-r from-primary to-secondary text-primary-content px-10 py-6 rounded-2xl shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.h3 
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Ready to get started?
          </motion.h3>
          <motion.p 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Sign up now and get your first interview free. No credit card required.
          </motion.p>
          {user?.freeInterview === 'Claimed' ? (
            <motion.button
              disabled
              className="px-8 py-3 rounded-lg bg-gray-300 text-gray-500 font-semibold text-lg cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Claimed
            </motion.button>
          ) : (
            <motion.a
              href="#"
              className="px-8 py-3 rounded-lg bg-base-100 text-primary font-semibold text-lg shadow hover:bg-base-200 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free
            </motion.a>
          )}
        </motion.div>
      </motion.section>
      <Footer />
    </div>
  );
};

export default Pricing;