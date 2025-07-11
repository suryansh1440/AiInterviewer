import React from 'react';

const Contact = () => {
  return (
    <section className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          If you have any questions, suggestions, or need support, feel free to get in touch with us!
        </p>

        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-800">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 font-semibold text-gray-800">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Write your message here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
