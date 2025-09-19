import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "HD Image Booster", path: "/PhotoEnhancer" },
  { name: "Features", path: "/features" },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 w-full h-14 z-50  bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/favicon.svg"
              alt="PixFit Logo"
              className="w-10 h-10 object-contain opacity-90 group-hover:opacity-100 transition"
            />
            <span className="text-xl font-semibold tracking-wide text-gray-100 group-hover:text-white transition">
              𝙋𝙞𝙭𝙁𝙞𝙩
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
                  className={`relative text-sm font-medium transition-colors duration-200 ${isActive
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeLink"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white/80 rounded-full"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.4,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Menu panel */}
            <motion.div
              key="mobile-panel"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="h-full flex flex-col items-center justify-center space-y-10"
            >
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`relative group text-2xl font-semibold tracking-wide transition-colors duration-200 ${isActive ? "text-white" : "text-gray-300 hover:text-white"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.name}
                      {/* Underline animation */}
                      <span
                        className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-white rounded-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
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
