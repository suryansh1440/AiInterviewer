import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Logo/Brand and Description */}
        <div className="flex flex-col items-center md:items-start gap-3 max-w-xs">
          <div className="flex items-center gap-2 text-2xl font-bold select-none">
            <span className="text-white">AI Interview</span>
            <span className="text-blue-500 text-3xl">.</span>
          </div>
          <p className="text-gray-400 text-sm mt-1 text-center md:text-left">
            Your smart platform for AI-powered interview practice. Get instant feedback, track your progress, and boost your confidence for real interviews.
          </p>
        </div>
        {/* Newsletter Subscription */}
        <div className="flex flex-col items-center gap-2 w-full max-w-sm">
          <span className="font-semibold text-gray-100 mb-1">Subscribe to our newsletter</span>
          <form className="flex w-full max-w-xs">
            <input
              type="email"
              className="flex-1 px-3 py-2 rounded-l-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your email address"
              disabled
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-r-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200 cursor-not-allowed"
              disabled
            >
              Subscribe
            </button>
          </form>
          <span className="text-xs text-gray-500">(Demo only)</span>
        </div>
        {/* Copyright & Socials */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-4 mb-1">
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.77c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.12 2.94 3.99 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" /></svg>
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg>
            </a>
            <a href="#" className="hover:text-pink-500 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07c-1.28.058-2.15.25-2.91.53-.8.29-1.48.68-2.16 1.36-.68.68-1.07 1.36-1.36 2.16-.28.76-.472 1.63-.53 2.91C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.25 2.15.53 2.91.29.8.68 1.48 1.36 2.16.68.68 1.36 1.07 2.16 1.36.76.28 1.63.472 2.91.53C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.28-.058 2.15-.25 2.91-.53.8-.29 1.48-.68 2.16-1.36.68-.68 1.07-1.36 1.36-2.16.28-.76.472-1.63.53-2.91.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.25-2.15-.53-2.91-.29-.8-.68-1.48-1.36-2.16-.68-.68-1.36-1.07-2.16-1.36-.76-.28-1.63-.472-2.91-.53C15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.844-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>
            </a>
          </div>
          <span className="text-xs text-gray-500">&copy; {new Date().getFullYear()} AI Interview. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
