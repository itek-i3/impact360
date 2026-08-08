import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Events", path: "/events" },
  { name: "Reports", path: "/campaign" },
  { name: "Subscription", path: "/subscription" },
];

const EVENT_ITEMS = [
  { name: "Roadshow", path: "/events/roadshow" },
  { name: "Locals", path: "/events/locals" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [eventsExpandedMobile, setEventsExpandedMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      {/* ─── QR MODAL ─── */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            key="qr"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
          >
            <motion.div
              className="bg-white dark:bg-[#111] rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:bg-black/10 transition-colors"
              >✕</button>
              <div className="text-center space-y-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                  JOIN THE COMMUNITY
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scan to join our WhatsApp community</p>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl flex items-center justify-center">
                  <img src="/frame.png" alt="WhatsApp QR Code" className="w-56 h-56 object-contain" />
                </div>
                <a
                  href="https://chat.whatsapp.com/I0g8kpCNvSn84yWQxybzHa"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-all duration-300 text-sm"
                >Open WhatsApp →</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ─── */}
      <div className="fixed top-4 left-0 right-0 z-50 px-3 pointer-events-none">
        <div className="max-w-[1400px] mx-auto pointer-events-auto">
          <motion.div
            animate={{ boxShadow: scrolled ? "0 12px 48px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.18)" }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#0c0c0e]/95 backdrop-blur-2xl border border-black/8 dark:border-white/[0.07]"
          >

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#306CEC]/30 blur-sm scale-110" />
                <img
                  src="/logo2.png"
                  alt="Impact360"
                  className="relative w-9 h-9 rounded-full object-contain"
                />
              </div>
              <span
                className="text-[17px] font-black text-[#0a0a14] dark:text-white tracking-tight"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Impact360
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((item) => {
                const active = location.pathname === item.path || (item.name === "Events" && location.pathname.startsWith("/events"));

                if (item.name === "Events") {
                  return (
                    <li key="Events" className="relative"
                      onMouseEnter={() => setEventsOpen(true)}
                      onMouseLeave={() => setEventsOpen(false)}
                    >
                      <Link
                        to="/events"
                        className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-[13px] font-medium leading-none transition-all duration-200 ${
                          active
                            ? "text-[#306CEC] bg-[#306CEC]/8 dark:text-white dark:bg-white/10"
                            : "text-gray-500 dark:text-white/50 hover:text-[#0a0a14] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/6"
                        }`}
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Events
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${eventsOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>

                      <AnimatePresence>
                        {eventsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl bg-white dark:bg-[#0c0c0e] border border-black/10 dark:border-white/[0.07] shadow-xl overflow-hidden"
                          >
                            {EVENT_ITEMS.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                onClick={() => setEventsOpen(false)}
                                className={`flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium transition-all duration-150 ${
                                  location.pathname === sub.path
                                    ? "text-[#306CEC] bg-[#306CEC]/6 dark:text-white dark:bg-white/8"
                                    : "text-gray-600 dark:text-white/60 hover:text-[#0a0a14] dark:hover:text-white hover:bg-black/4 dark:hover:bg-white/6"
                                }`}
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-[13px] font-medium leading-none transition-all duration-200 ${
                        active
                          ? "text-[#306CEC] bg-[#306CEC]/8 dark:text-white dark:bg-white/10"
                          : "text-gray-500 dark:text-white/50 hover:text-[#0a0a14] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/6"
                      }`}
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowQR(true)}
                className="hidden lg:flex items-center px-5 py-2.5 rounded-xl bg-[#306CEC] text-white text-[13px] font-bold hover:bg-[#4A80FF] active:scale-95 transition-all duration-200"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Join Community
              </button>

              <div className="opacity-70 hover:opacity-100 transition-opacity">
                <DarkModeToggle />
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl hover:bg-white/8 transition-colors"
              >
                <motion.span
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                  className="block w-5 h-[1.5px] rounded-full bg-[#0a0a14] dark:bg-white origin-center transition-all"
                />
                <motion.span
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                  className="block w-5 h-[1.5px] rounded-full bg-[#0a0a14] dark:bg-white"
                />
                <motion.span
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                  className="block w-5 h-[1.5px] rounded-full bg-[#0a0a14] dark:bg-white origin-center transition-all"
                />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── MOBILE MENU ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile"
            className="fixed inset-0 z-[49]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setMenuOpen(false)} />

            <motion.div
              className="absolute top-[80px] left-4 right-4 rounded-2xl bg-[#0c0c0e]/98 border border-white/[0.07] overflow-hidden backdrop-blur-2xl"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              {/* Links */}
              <div className="px-2 py-3">
                {NAV_LINKS.map((item, i) => {
                  const active = location.pathname === item.path || (item.name === "Events" && location.pathname.startsWith("/events"));

                  if (item.name === "Events") {
                    return (
                      <motion.div key="Events" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <div className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${active ? "bg-white/10" : "hover:bg-white/6"}`}>
                          <Link
                            to="/events"
                            onClick={() => setMenuOpen(false)}
                            className={`flex-1 font-semibold text-[15px] ${active ? "text-white" : "text-white/50 hover:text-white"}`}
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            Events
                          </Link>
                          <button
                            onClick={() => setEventsExpandedMobile(v => !v)}
                            className="p-1 text-white/50 hover:text-white"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${eventsExpandedMobile ? "rotate-180" : ""}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <AnimatePresence>
                          {eventsExpandedMobile && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {EVENT_ITEMS.map((sub) => (
                                <Link
                                  key={sub.name}
                                  to={sub.path}
                                  onClick={() => setMenuOpen(false)}
                                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                                    location.pathname === sub.path
                                      ? "text-white bg-white/8"
                                      : "text-white/40 hover:text-white hover:bg-white/6"
                                  }`}
                                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                  <span className="w-1 h-1 rounded-full bg-[#306CEC]" />
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:text-white hover:bg-white/6"
                        }`}
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider + CTA */}
              <div className="border-t border-white/6 px-3 py-3">
                <button
                  onClick={() => { setMenuOpen(false); setShowQR(true); }}
                  className="w-full py-3.5 rounded-xl bg-[#306CEC] text-white font-bold text-sm hover:bg-[#4A80FF] transition-all duration-200"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  Join Community →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
