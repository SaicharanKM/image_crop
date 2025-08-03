import React from "react";
import {
  FaCropAlt,
  FaRulerCombined,
  FaImage,
  FaShieldAlt,
  FaMagic,
  FaDownload,
  FaMobileAlt,
  FaLock
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaCropAlt className="text-3xl text-amber-500" />,
      title: "Precision Cropping",
      description: "Choose from 10+ preset aspect ratios (1:1, 16:9, 4:5) or create custom dimensions with pixel-perfect accuracy.",
      highlight: "Perfect for Instagram, Facebook, YouTube & more"
    },
    {
      icon: <FaRulerCombined className="text-3xl text-amber-500" />,
      title: "Custom Dimensions",
      description: "Manually set exact width and height values. Our smart ratio locking maintains proportions automatically.",
      highlight: "Ideal for print materials, banners, and digital ads"
    },
    {
      icon: <FaImage className="text-3xl text-amber-500" />,
      title: "Premium Output Quality",
      description: "Export crystal-clear images with adjustable quality settings (60-100%). Supports JPG and PNG formats.",
      highlight: "Preserves EXIF data and color profiles"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-amber-500" />,
      title: "100% Private Processing",
      description: "All image processing happens in your browser. We never upload your files to external servers.",
      highlight: "Military-grade security for sensitive content"
    },
    {
      icon: <FaMagic className="text-3xl text-amber-500" />,
      title: "Precision Cropping",
      description: "Easily crop your images with predefined aspect ratios or set your own custom dimensions.",
      highlight: "No guesswork – just clean, pixel-perfect cuts"
    },
    {
      icon: <FaDownload className="text-3xl text-amber-500" />,
      title: "One-by-One Export",
      description: "Download each cropped image instantly after editing. Simple and straightforward.",
      highlight: "Ideal for quick edits and uploads"
    }
  ];

  return (
    <div className="w-full px-4 py-16 bg-gradient-to-b from-white to-gray-50 " id="features">
      <div className="max-w-7xl mx-auto mt-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-amber-700 bg-amber-100 rounded-full mb-4">
            PROFESSIONAL TOOLS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for <span className="text-amber-600">Perfect Images</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to crop, resize, and optimize images for any platform or purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-amber-100"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-amber-50 rounded-xl mb-6 group-hover:bg-amber-100 transition">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex items-center text-sm text-amber-700 font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-3xl font-bold mb-4">Mobile-Optimized Experience</h3>
                <p className="text-amber-100 mb-6">
                  Our responsive design works flawlessly on all devices. Crop images directly from your phone or tablet with the same powerful tools.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center bg-amber-400 bg-opacity-20 px-4 py-2 rounded-full">
                    <FaMobileAlt className="mr-2" />
                    <span>Touch-friendly</span>
                  </div>
                  <div className="flex items-center bg-amber-400 bg-opacity-20 px-4 py-2 rounded-full">
                    <FaLock className="mr-2" />
                    <span>No app install</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-white bg-opacity-10 p-6 rounded-xl border border-amber-300 border-opacity-30">
                <h4 className="font-bold text-xl mb-4">Why choose PixFit Pro?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No watermarks or usage limits</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Faster than desktop software</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free updates with new features</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
        <div className="w-full mt-8 rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white">
          <div className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 py-6 text-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Logo & Title */}
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <span className="bg-white text-amber-600 px-5 py-2 rounded-lg text-2xl font-extrabold shadow-md">
                    PixFit
                  </span>
                  <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                    Premium Image Cropping & Resizing Tool
                  </h1>
                </div>

                {/* Badges & Features */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="bg-white text-amber-700 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
                    FREE
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/90 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/30 w-2 h-2 rounded-full"></span>
                      No watermarks
                    </div>
                    <div className="w-px h-4 bg-white/40"></div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/30 w-2 h-2 rounded-full"></span>
                      Unlimited exports
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;