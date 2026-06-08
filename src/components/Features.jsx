import React from "react";
import {
  FaCropAlt,
  FaRulerCombined,
  FaImage,
  FaShieldAlt,
  FaMagic,
  FaDownload,
  FaPhotoVideo
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaCropAlt aria-hidden="true" />,
      title: "Precision Cropping",
      description:
        "Crop images with preset aspect ratios or set custom dimensions with pixel-perfect accuracy."
    },
    {
      icon: <FaRulerCombined aria-hidden="true" />,
      title: "Custom Dimensions",
      description:
        "Manually set width and height values with smart ratio locking to maintain proportions."
    },
    {
      icon: <FaImage aria-hidden="true" />,
      title: "High Output Quality",
      description:
        "Export crystal clear images with adjustable quality. Supports JPG, PNG, WEBP, and AVIF."
    },
    {
      icon: <FaShieldAlt aria-hidden="true" />,
      title: "Private Processing",
      description:
        "All processing happens locally in your browser. Your files never leave your device."
    },
    {
      icon: <FaMagic aria-hidden="true" />,
      title: "Lightning Fast",
      description:
        "Because everything runs locally, there are no server delays or uploading wait times."
    },
    {
      icon: <FaDownload aria-hidden="true" />,
      title: "Instant Export",
      description:
        "Download your edited images instantly with no watermarks or hidden restrictions."
    },
    {
      icon: <FaPhotoVideo aria-hidden="true" />,
      title: "Clarity Enhancer",
      description:
        "Use our built-in local sharpening matrix to restore detail and clarity to soft photos."
    }
  ];

  return (
    <section id="features" className="w-full px-6 py-20 md:py-28 bg-[#F7F7F9] font-sans" aria-label="Features">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-16 md:mb-20">
          <span className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block shadow-sm">
            Why Choose PixFit
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Professional tools,<br className="hidden md:block" /> simplified for everyone.
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            Crop, resize, convert, and enhance your images directly in your browser with zero server delays and absolute privacy.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <article
              key={idx}
              className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
              aria-labelledby={`feature-title-${idx}`}
            >
              {/* Icon Container with Hover Effect */}
              <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-2xl mb-6 text-2xl text-gray-900  transition-colors duration-300">
                {feature.icon}
              </div>
              
              <h3
                id={`feature-title-${idx}`}
                className="text-xl font-bold text-gray-900 mb-3 tracking-tight"
              >
                {feature.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Features;