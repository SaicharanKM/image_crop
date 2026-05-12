import React from "react";
import {
  FaCropAlt,
  FaRulerCombined,
  FaImage,
  FaShieldAlt,
  FaMagic,
  FaDownload,
  FaPhotoVideo,
  FaCompressAlt,
  FaExchangeAlt
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaCropAlt className="text-3xl text-black" />,
      title: "Smart Image Cropping",
      description:
        "Crop images precisely using preset aspect ratios or custom dimensions with real-time preview."
    },
    {
      icon: <FaRulerCombined className="text-3xl text-black" />,
      title: "Resize with Precision",
      description:
        "Resize images to any width and height while maintaining perfect quality and proportions."
    },
    {
      icon: <FaExchangeAlt className="text-3xl text-black" />,
      title: "Image Format Converter",
      description:
        "Convert images instantly between JPG, PNG, WEBP, and other popular formats."
    },
    {
      icon: <FaCompressAlt className="text-3xl text-black" />,
      title: "Advanced Compression",
      description:
        "Reduce image size efficiently while preserving image clarity and visual quality."
    },
    {
      icon: <FaImage className="text-3xl text-black" />,
      title: "HD Quality Export",
      description:
        "Download optimized high-resolution images without losing sharpness or details."
    },
    {
      icon: <FaShieldAlt className="text-3xl text-black" />,
      title: "100% Secure Processing",
      description:
        "Your images stay private. Everything is processed securely inside your browser."
    },
    {
      icon: <FaMagic className="text-3xl text-black" />,
      title: "Simple & Modern UI",
      description:
        "Clean interface designed for fast editing, easy navigation, and smooth workflow."
    },
    {
      icon: <FaDownload className="text-3xl text-black" />,
      title: "Instant Downloads",
      description:
        "Export and download your edited images instantly with no watermark or signup."
    },
    {
      icon: <FaPhotoVideo className="text-3xl text-black" />,
      title: "Social Media Ready",
      description:
        "Create perfectly optimized images for Instagram, YouTube, websites, profiles, and more."
    }
  ];

  return (
    <section
      id="features"
      className="w-full bg-white py-20 px-6"
      aria-label="Features"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 mb-3">
            Features
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold text-black mb-5"
            style={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Powerful Image Editing Tools
          </h2>

          <p
            className="max-w-2xl mx-auto text-lg text-black/70 leading-relaxed"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Everything you need to crop, resize, compress,
            and convert images online with professional quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {features.map((feature, idx) => (
            <article
              key={idx}
              className="group border border-black/10 rounded-3xl p-7 bg-white hover:border-black hover:shadow-xl transition-all duration-300"
            >

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center mb-5 group- group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="text-xl font-semibold text-black mb-3"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-black/70 leading-relaxed text-sm"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
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