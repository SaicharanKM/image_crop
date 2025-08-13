import React from "react";
import {
  FaMobileAlt,
  FaLock,
  FaCropAlt,
  FaRulerCombined,
  FaImage,
  FaShieldAlt,
  FaMagic,
  FaDownload
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaCropAlt className="text-4xl text-amber-600" aria-hidden="true" />,
      title: "Precision Cropping",
      description:
        "Choose from 10+ preset aspect ratios or create custom dimensions with pixel-perfect accuracy.",
      highlight: "Perfect for Instagram, Facebook, YouTube & more"
    },
    {
      icon: <FaRulerCombined className="text-4xl text-amber-600" aria-hidden="true" />,
      title: "Custom Dimensions",
      description:
        "Manually set exact width and height values with smart ratio locking to maintain proportions automatically.",
      highlight: "Ideal for print materials, banners, and digital ads"
    },
    {
      icon: <FaImage className="text-4xl text-amber-600" aria-hidden="true" />,
      title: "Premium Output Quality",
      description:
        "Export crystal-clear images with adjustable quality settings. Supports JPG and PNG formats.",
      highlight: "Preserves EXIF data and color profiles"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-amber-600" aria-hidden="true" />,
      title: "100% Private Processing",
      description:
        "All processing happens in your browser. No files are uploaded to our servers.",
      highlight: "Military-grade security for sensitive content"
    },
    {
      icon: <FaMagic className="text-4xl text-amber-600" aria-hidden="true" />,
      title: "Easy & Accurate Cropping",
      description:
        "Effortlessly crop with predefined aspect ratios or custom dimensions.",
      highlight: "Clean, pixel-perfect cuts every time"
    },
    {
      icon: <FaDownload className="text-4xl text-amber-600" aria-hidden="true" />,
      title: "Instant One-by-One Export",
      description:
        "Download each cropped image instantly after editing.",
      highlight: "Perfect for quick edits and uploads"
    }
  ];

  return (
    <section
      id="features"
      className="w-full px-6 py-20 bg-gradient-to-b from-white to-gray-50"
      aria-label="Features"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-100 rounded-full mb-4 tracking-wide uppercase shadow-sm">
            Professional Tools
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            Powerful Features for{" "}
            <span className="text-amber-600">Perfect Images</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Everything you need to crop, resize, and optimize images for any
            platform with precision and quality.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <article
              key={idx}
              className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 ease-in-out"
              aria-labelledby={`feature-title-${idx}`}
            >
              <div className="w-16 h-16 flex items-center justify-center bg-amber-50 rounded-2xl mb-6 group-hover:bg-amber-100 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3
                id={`feature-title-${idx}`}
                className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors"
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-5">{feature.description}</p>
              <p className="flex items-center text-sm font-semibold text-amber-700">
                <svg
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature.highlight}
              </p>
            </article>
          ))}
        </div>

        {/* Mobile Section */}
        {/* <div className="mt-20 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-10 md:p-16 text-white shadow-lg">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <h3 className="text-3xl font-extrabold leading-tight">
                Mobile-Optimized Experience
              </h3>
              <p className="text-amber-100 text-lg">
                Our responsive design works flawlessly on all devices. Crop images
                directly from your phone or tablet with the same powerful tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-5 py-3 rounded-full font-semibold shadow-sm hover:bg-opacity-30 transition">
                  <FaMobileAlt className="text-white" aria-hidden="true" />
                  <span>Touch-friendly</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-20 px-5 py-3 rounded-full font-semibold shadow-sm hover:bg-opacity-30 transition">
                  <FaLock className="text-white" aria-hidden="true" />
                  <span>No app install</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-white bg-opacity-10 p-8 rounded-2xl border border-amber-300 border-opacity-40 shadow-inner">
              <h4 className="font-bold text-2xl mb-6">Why choose PixFit Pro?</h4>
              <ul className="list-disc list-inside space-y-4 text-white/90 text-lg">
                <li>No watermarks or usage limits</li>
                <li>Faster than desktop software</li>
                <li>Free updates with new features</li>
              </ul>
            </div>
          </div>
        </div> */}

        {/* Footer */}
        <footer className="w-full mt-16 rounded-2xl shadow-lg overflow-hidden border border-gray-100 bg-white">
          <div className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 py-6 text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <span className="bg-white text-amber-600 px-6 py-3 rounded-lg text-3xl font-extrabold shadow-lg tracking-wide">
                    PixFit
                  </span>
                  <h1 className="text-2xl md:text-3xl font-semibold leading-tight max-w-md">
                    Premium Image Cropping & Resizing Tool
                  </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white text-amber-700 font-bold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition">
                    FREE
                  </div>
                  <div className="flex items-center gap-6 text-sm text-white/95 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/30 w-2 h-2 rounded-full"></span>
                      No watermarks
                    </div>
                    <div className="w-px h-5 bg-white/40"></div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/30 w-2 h-2 rounded-full"></span>
                      Unlimited exports
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Features;
