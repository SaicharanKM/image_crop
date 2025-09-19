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
      icon: <FaCropAlt className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "Precision Cropping",
      description:
        "Crop images with preset aspect ratios or set custom dimensions with pixel-perfect accuracy."
    },
    {
      icon: <FaRulerCombined className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "Custom Dimensions",
      description:
        "Manually set width and height values with smart ratio locking to maintain proportions."
    },
    {
      icon: <FaImage className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "High Output Quality",
      description:
        "Export clear images with adjustable quality settings. Supports JPG and PNG formats."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "Private Processing",
      description:
        "All processing happens locally in your browser. Your files never leave your device."
    },
    {
      icon: <FaMagic className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "Easy to Use",
      description:
        "Effortlessly crop and resize images with a clean and intuitive interface."
    },
    {
      icon: <FaDownload className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "Instant Export",
      description:
        "Download your edited images instantly with no watermarks or restrictions."
    },
    {
      icon: <FaPhotoVideo className="text-3xl text-gray-700" aria-hidden="true" />,
      title: "HD Image Converter",
      description:
        "Convert your images into high-definition formats without losing clarity or detail."
    }
  ];

  return (
    <section id="features" className="w-full px-6 py-16 bg-white" aria-label="Features">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional tools to crop, resize, convert, and optimize images with simplicity and accuracy.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <article
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              aria-labelledby={`feature-title-${idx}`}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3
                id={`feature-title-${idx}`}
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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
