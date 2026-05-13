import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/Features" },
  { name: "Privacy Policy", path: "/privacy-policy" },
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
    <nav className="fixed top-0 w-full h-16 z-40 bg-[#0d1b2a] border-b border-[#415a77]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-amber-500 ">
            PixFit
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-lg font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-amber-500 "
                      : "text-[#e0e1dd] hover:text-[#778da9]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeLink"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#778da9] rounded-full"
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
              className="p-2 rounded-md text-[#e0e1dd] hover:text-[#778da9] focus:outline-none focus:ring-2 focus:ring-amber-500 "
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              key="mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="relative h-full w-full md:hidden bg-[#1b263b] pt-16 flex flex-col items-center space-y-6 overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 p-2 rounded-md text-[#ffffff] hover:text-amber-500 "
              >
                <X className="h-6 w-6" />
              </button>

              {/* Links */}
              <div className="w-full flex flex-col items-center mt-6">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="w-full flex justify-center"
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`py-4 px-6 text-2xl font-semibold rounded-lg ${
                          isActive
                            ? "text-amber-500 "
                            : "text-[#e0e1dd] hover:text-[#778da9]"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
