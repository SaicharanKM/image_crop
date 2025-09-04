import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "HD Image Booster", path: "/PhotoEnhancer" },
  { name: "Features", path: "/features" },

  
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "h-14 bg-[#0d1b2a]/95 backdrop-blur-md border-b border-[#415a77]/30 shadow-lg" 
          : "h-16 bg-[#0d1b2a] border-b border-[#415a77]/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-xl font-bold text-amber-500 group"
          >
          
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              PixFit
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-amber-500"
                      : "text-[#e0e1dd] hover:text-amber-400"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeLink"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.45,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

        

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-md text-[#e0e1dd] hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="relative h-full w-4/5 max-w-sm ml-auto bg-[#1b263b] shadow-xl flex flex-col overflow-y-auto"
            >
              {/* Header with logo and close button */}
              <div className="flex items-center justify-between p-6 border-b border-[#415a77]/30">
                <Link 
                  to="/" 
                  className="flex items-center text-xl font-bold text-amber-500"
                  onClick={() => setIsOpen(false)}
                >
                  PixFit
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md text-[#778da9] hover:text-amber-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col p-6 space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                          isActive
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-[#e0e1dd] hover:text-amber-400 hover:bg-white/5"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.name}
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 w-2 h-2 bg-amber-500 rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile CTA Button */}
              <div className="mt-auto p-6 border-t border-[#415a77]/30">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-4 text-center font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-md"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}