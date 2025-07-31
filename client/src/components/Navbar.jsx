import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Crown, Menu, XCircle } from "lucide-react";
import { useModalStore } from "../store/useModalStore";

const Navbar = () => {
  const { user , logout} = useAuthStore();
  const { setOpenModal } = useModalStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isPro = user && user.subscription === 'pro';

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);

  return (
    <nav className="w-full shadow-md px-4 md:px-8 py-3 sticky top-0 z-30 backdrop-blur bg-base-100/70">
      <div className="flex items-center justify-between">
        <Link to="/">
          <div className="logo text-2xl font-bold text-base-content flex items-center select-none relative" style={{ minWidth: 'fit-content' }}>
            <span className="relative inline-block mr-1">
              {isPro && (
                <Crown className="w-6 h-6 text-yellow-400 absolute left-[-15%] -top-3 -rotate-20 drop-shadow" style={{ zIndex: 2 }} />
              )}
              <span className="inline-block">A</span>I
            </span>
            Interview
            <span className="dot text-primary ml-1">.</span>
          </div>
        </Link>
        {/* Hamburger menu for small screens only */}
        <button
          className="sm:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary/30"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-7 h-7 text-primary" />
        </button>
        {/* Nav links for sm and up */}
        <ul className="hidden sm:flex items-center gap-6 text-base-content font-medium">
          <li><Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link></li>
          {user && (
            <>
              <li><Link to="/start" className="hover:text-primary transition-colors duration-200">Interview</Link></li>
            </>
          )}
          <li><Link to="/social/post" className="hover:text-primary transition-colors duration-200">Social</Link></li>
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
                  <img 
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border-2 border-primary shadow-sm object-cover"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }}
                  />
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
        {/* Slide-in menu for mobile (sm and below) */}
        <ul
          className={`fixed sm:hidden  top-0 right-0 h-full w-64 bg-base-100/95 shadow-lg flex flex-col items-start gap-1 text-base-content font-medium p-6 transition-all duration-300 z-100 overflow-y-auto
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ height: '100vh' }}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-base-200"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <XCircle className="w-6 h-6 text-primary" />
          </button>
          <li><Link to="/" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg> Home</Link></li>
          {user && (
            <>
              <li><Link to="/start" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg> Interview</Link></li>
            </>
          )}
          <li><Link to="/social/post" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg> Social</Link></li>
          <li><Link to="/pricing" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path d="M19.4 15a1.65 1.65 0 01-1.4.8H6a1.65 1.65 0 01-1.4-.8L2 12V7a2 2 0 012-2h16a2 2 0 012 2v5l-2.6 3z" /></svg> Pricing</Link></li>
          <li><Link to="/contact" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5a8.38 8.38 0 01-1.9.5 4.48 4.48 0 00-7.6 0 8.38 8.38 0 01-1.9-.5" /><path d="M3 19v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg> Contact</Link></li>
          <li><Link to="/setting" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 01-1.4.8L16 17.2a1.65 1.65 0 01-2.8 0l-2-1.4a1.65 1.65 0 01-1.4-.8L4.6 15a1.65 1.65 0 01-.8-1.4V10.4a1.65 1.65 0 01.8-1.4L7.2 7.6a1.65 1.65 0 011.4-.8l2-1.4a1.65 1.65 0 012.8 0l2 1.4a1.65 1.65 0 011.4.8l2.6 1.4a1.65 1.65 0 01.8 1.4v3.2a1.65 1.65 0 01-.8 1.4z" /></svg> Settings</Link></li>
          {/* Dashboard sidebar links for mobile only */}
          {user && (
            <>
              <li><Link to="/dashboard/profile" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><img src={user.profilePic || "/avatar.png"} alt={user.name}  className="w-6 h-6 rounded-full border-2 border-primary shadow-sm object-cover" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/avatar.png"; }} /><span className="font-semibold">{user.name}</span></Link></li>
              <li><Link to="/dashboard/attempt" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /></svg> Attempts</Link></li>
              {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                <li><Link to="/dashboard/adminPanel" className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors duration-200" onClick={() => setMenuOpen(false)}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M9 21V9" /></svg> Admin Panel</Link></li>
              )}
              <li><button onClick={() => { setMenuOpen(false); logout(); navigate("/")}} className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-error hover:bg-error hover:text-error-content transition-colors duration-200"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4" /></svg> Logout</button></li>
            </>
          )}
          {!user && (
            <>
              <li className="w-full">
                <button
                  onClick={() => { setOpenModal(); setMenuOpen(false); }}
                  className="ml-2 px-5 py-2 rounded-md bg-primary text-primary-content font-semibold shadow hover:bg-primary-focus transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                >
                  Login
                </button>
              </li>
            </>
          )}
        </ul>
        {/* Overlay for mobile menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 sm:hidden"
            style={{ height: '100vh' }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
