import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

const Contact = () => {
  return (
    <section className="min-h-screen bg-base-200 py-16 px-4 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="max-w-2xl w-full text-center mb-10">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
            <MessageCircle className="w-8 h-8" />
          </span>
          <h2 className="text-4xl font-extrabold text-primary mb-2">Contact Us</h2>
          <p className="text-base-content/70 text-lg max-w-xl mx-auto">
            Have questions, suggestions, or need support? We're here to help! Fill out the form below and our team will get back to you soon.
          </p>
        </div>
      </div>

      {/* Contact Card */}
      <div className="max-w-xl w-full mx-auto bg-base-100 shadow-xl rounded-2xl p-8 border border-base-300">
        {/* Success Message Placeholder */}
        {/* <div className="alert alert-success mb-6">Thank you for reaching out! We'll get back to you soon.</div> */}
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-base-content">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your full name"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-base-content">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Your email address"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 font-semibold text-base-content">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Write your message here..."
              className="textarea textarea-bordered w-full min-h-[120px]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-lg font-semibold shadow-md"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-8 border-t border-base-300 pt-6 flex flex-col gap-3 text-base-content/70">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <span>support@aiinterview.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span>Live chat support coming soon!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
