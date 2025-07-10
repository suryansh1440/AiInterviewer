import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const isSignedIn = true;
  

  return (
    <nav className="navbar w-full shadow-md px-8 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur bg-white/70">
      <div className="logo text-2xl font-bold text-gray-800 flex items-center select-none">
        AI Interview<span className="dot text-blue-500 ml-1">.</span>
      </div>
      <ul className="nav-links flex items-center gap-6 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-blue-500 transition-colors duration-200">Home</Link></li>
        <li><Link to="/about" className="hover:text-blue-500 transition-colors duration-200">About</Link></li>
        {isSignedIn && (<li><Link to="#" className="hover:text-blue-500 transition-colors duration-200">Interview</Link></li>)}
        <li><Link to="/pricing" className="hover:text-blue-500 transition-colors duration-200">Pricing</Link></li>
        <li><Link to="#" className="hover:text-blue-500 transition-colors duration-200">Contact</Link></li>
        <li><Link to="#" className="hover:text-blue-500 transition-colors duration-200">Settings</Link></li>
        {isSignedIn ? (
          <li className="relative account-dropdown">
            <button
              id="accountBtn"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => setAccountOpen((open) => !open)}
            >
              <img src='https://randomuser.me/api/portraits/men/75.jpg' alt="Surya" className="w-7 h-7 rounded-full border-2 border-blue-200 shadow-sm object-cover" />
              <span className="font-semibold">Suryansh</span>
              <svg className={`w-4 h-4 ml-1 transition-transform ${accountOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {accountOpen && (
              <div className="dropdown-menu absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl py-2 z-20 animate-fade-in border border-gray-100">
                
                <Link to="#" className="block px-5 py-2 hover:bg-blue-50 transition-colors duration-200">Profile</Link>
                <Link to="#" className="block px-5 py-2 hover:bg-blue-50 transition-colors duration-200">History</Link>
                <Link to="#" className="block px-5 py-2 text-red-500 hover:bg-red-50 transition-colors duration-200">Logout</Link>
              </div>
            )}
          </li>
        ) : (
          <>
            <li>
              <Link
                to="#"
                className="ml-2 px-5 py-2 rounded-md bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
