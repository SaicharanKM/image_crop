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
    <>
      <nav
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 48px)",
          maxWidth: "780px",
          height: "56px",
          zIndex: 50,
          background: "#000000",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center justify-between h-full px-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/favicon.svg"
                alt="PixFit"
                className="w-5 h-5 object-contain opacity-90 group-hover:opacity-100 transition"
              />
            </div>

            <span className="text-[15px] font-semibold tracking-wide text-white/90">
              PixFit
            </span>
          </Link>

          {/* Desktop Links */}
          <div
            className="hidden md:flex items-center gap-1 p-1 rounded-xl"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  aria-current={isActive ? "page" : undefined}
                  className="px-4 py-[7px] rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "rgba(255,255,255,0.09)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.95)",
                          boxShadow:
                            "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                        }
                      : {
                          color: "rgba(255,255,255,0.45)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">

            {/* CTA Button */}
            <a
              href="#"
              className="hidden md:flex items-center gap-1 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-200 hover:bg-white/10"
              style={{
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Free
            </a>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
              onClick={() => setIsOpen((s) => !s)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{
              background: "rgba(0,0,0,0.9)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mobile Links */}
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.path;

              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-semibold tracking-tight transition-colors duration-200"
                    style={{
                      color: isActive
                        ? "white"
                        : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}