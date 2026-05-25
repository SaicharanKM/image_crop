import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

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
    <nav className="fixed top-0 w-full h-[60px] z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 font-sans transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/favicon.svg"
              alt="PixFit Logo"
              className="w-9 h-9 object-contain  group-hover:scale-105 " 
              // Note: 'brightness-0 invert' makes the SVG white. Remove if your SVG is already colored/white.
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Menu panel */}
            <motion.div
              key="mobile-panel"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="h-full flex flex-col items-center justify-center space-y-8"
            >
              {/* Mobile Logo */}
              <div className="absolute top-10 flex flex-col items-center gap-3">
                  <img src="/favicon.svg" alt="PixFit" className="w-12 h-12 brightness-0 invert" />
                  <span className="font-extrabold text-white tracking-tight text-xl">PixFit</span>
              </div>

              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`relative group text-3xl font-extrabold tracking-tight transition-colors duration-200 ${
                        isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.name}
                      {/* Underline animation */}
                      <span
                        className={`absolute left-0 right-0 -bottom-2 h-1 bg-white rounded-full transition-transform duration-300 origin-left ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}