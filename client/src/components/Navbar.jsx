import React, { useState } from "react";
import { Link} from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore"
import { Award, XCircle, Crown } from "lucide-react";
import { useModalStore } from "../store/useModalStore";
const Navbar = () => {
  const {user} = useAuthStore();
  const {setOpenModal} = useModalStore();

  const isPro = user && user.subscription === 'pro';

  return (
    <nav className="navbar w-full shadow-md px-8 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur bg-base-100/70">
      <Link to="/">
        <div className="logo text-2xl font-bold text-base-content flex items-center select-none relative" style={{minWidth: 'fit-content'}}>
          <span className="relative inline-block mr-1">
            {isPro && (
              <Crown className="w-6 h-6 text-yellow-400 absolute left-[-15%] -top-3 -rotate-20 drop-shadow" style={{zIndex:2}} />
            )}
            <span className="inline-block">A</span>I
          </span>
          Interview
          <span className="dot text-primary ml-1">.</span>
        </div>
      </Link>
      <ul className="nav-links flex items-center gap-6 text-base-content font-medium">
        <li><Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link></li>
        <li><Link to="/about" className="hover:text-primary transition-colors duration-200">About</Link></li>
        {user && (<li><Link to="/start" className="hover:text-primary transition-colors duration-200">Interview</Link></li>)}
        <li><Link to="/pricing" className="hover:text-primary transition-colors duration-200">Pricing</Link></li>
        <li><Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact</Link></li>
        <li><Link to="/setting" className="hover:text-primary transition-colors duration-200">Settings</Link></li>
        {user ? (
          <li className="relative account-dropdown">
            <Link to="/dashboard/profile">
            <button
              id="accountBtn"
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-base-200 transition-colors duration-200 border border-base-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <img src={user.profilePic || "/avatar.png"} alt={user.name} className="w-7 h-7 rounded-full border-2 border-primary shadow-sm object-cover" />
              <span className="font-semibold">{user.name}</span>
            </button>
              </Link>

          </li>
        ) : (
          <>
            <li>
              <button
              onClick={setOpenModal}
                className="ml-2 px-5 py-2 rounded-md bg-primary text-primary-content font-semibold shadow hover:bg-primary-focus transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Login
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
