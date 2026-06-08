import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Clarity Enhancer", path: "/PhotoEnhancer" },
  { name: "Features", path: "/features" },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    // Dark glassmorphism background
    <nav className="fixed top-0 w-full h-[60px] z-50 bg-black backdrop-blur-lg border-b border-white/10 font-sans transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group z-50">
            <img
              src="/favicon.svg"
              alt="PixFit Logo"
              className="w-9 h-9 object-contain group-hover:scale-105" 
            />
            <span className="text-xl font-extrabold tracking-tight text-white transition-colors">
              PixFit
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-sm font-semibold transition-colors duration-200 py-2 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeLink"
                      className="absolute left-0 right-0 -bottom-[19px] h-[3px] bg-white rounded-t-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.5,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center z-50">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* NEW: Mobile Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Sliding Drawer Panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed top-0 right-0 w-[80%] max-w-sm h-[100dvh] z-[70] bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-[60px] border-b border-white/10">
                <span className="text-lg font-bold text-white tracking-tight">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col px-6 py-8 space-y-6 flex-1 overflow-y-auto">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between pb-4 border-b border-white/5 text-xl font-bold tracking-tight transition-colors duration-200 ${
                          isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="flex items-center gap-2">
                           {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                           {link.name}
                        </span>
                        <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${isActive ? "text-white translate-x-1" : "text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1"}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Optional: Drawer Footer (e.g., copyright or secondary links) */}
              <div className="p-6 text-xs text-gray-600 font-medium">
                © {new Date().getFullYear()} PixFit. All rights reserved.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}