import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "HD Image Booster", path: "/PhotoEnhancer" },
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
    <nav className="fixed top-0 w-full h-16 z-40 bg-gradient-to-r from-[#0a0a0a] via-[#111827] to-[#1e1e1e] border-b border-[#2e2e2e] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-full">
        <div className="flex items-center justify-between h-full">

          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <img
              src="/PixFitlogo.jpg"
              alt="PixFit Pro Logo"
              className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-extrabold tracking-wide bg-[rgb(227,226,222)] bg-clip-text text-transparent hover:opacity-90 transition">
              PixFit
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-lg font-medium tracking-wide transition-colors duration-200 ${isActive
                    ? "text-yellow-400"
                    : "text-gray-300 hover:[rgb(227,226,222)] "
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeLink"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-yellow-400 rounded-full shadow-[0_0_6px_rgba(255,215,0,0.6)]"
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((s) => !s)}
              className="p-2 rounded-md text-gray-300 hover:text-[rgb(227,226,222)]  focus:outline-none focus:ring-2 focus:ring-[rgb(227,226,222)] "
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              key="mobile-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative h-full w-full md:hidden bg-[#0a0a0a] pt-16 flex flex-col items-center space-y-6 overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 p-2 rounded-md text-gray-400 outline-none focus:ring-2 ring-[rgb(227,226,222)]"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Links */}
              <div className="w-full flex flex-col mt-10">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="w-full flex justify-center"
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`py-3 px-6 text-xl font-semibold rounded-md ${isActive
                          ? "text-yellow-400"
                          : "text-gray-200 hover:text-yellow-300"
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
