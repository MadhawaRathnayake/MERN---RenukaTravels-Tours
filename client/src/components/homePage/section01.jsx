import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRoute, FaHotel, FaCar } from "react-icons/fa";

// Import images
import sec01 from "../../images/sec01-01.jpg";
import sec02 from "../../images/sec01-02.jpg";
import sec03 from "../../images/sec01-03.jpg";
import sec04 from "../../images/sec01-04.jpg";
import sec05 from "../../images/sec01-05.jpg";

export default function Section01() {
  const { currentUser } = useSelector((state) => state.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [sec01, sec02, sec03, sec04, sec05];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Features data
  const features = [
    {
      icon: (
        <HiOutlineLocationMarker className="text-amber-500 text-xl sm:text-2xl" />
      ),
      text: "Destinations",
    },
    {
      icon: <FaRoute className="text-amber-500 text-xl sm:text-2xl" />,
      text: "Travel Route",
    },
    {
      icon: <FaHotel className="text-amber-500 text-xl sm:text-2xl" />,
      text: "Accommodation",
    },
    {
      icon: <FaCar className="text-amber-500 text-xl sm:text-2xl" />,
      text: "Transportation",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-[80vh]">
      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: 1.05 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: `url(${slides[currentIndex]})`,
            }}
            className="w-full h-full bg-center bg-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center h-full pt-6 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
                It's a Big World Out There,{" "}
                <span className="text-amber-400">Go Explore</span>
              </h1>
              <p className="text-white text-base  sm:text-lg md:text-xl  mb-6 sm:mb-10 px-3">
                Dreaming of an unforgettable trip to Sri Lanka? Discover hidden
                gems, plan your itinerary, explore top hotels, and manage your
                budget with ease. Start crafting your personalized Sri Lankan
                adventure today!
              </p>
            </motion.div>

            {!currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="z-10"
              >
                <a
                  href="/signin"
                  className="inline-block bg-amber-500 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300"
                >
                  Get Started
                </a>
              </motion.div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </div>

      {/* Features Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 md:p-10"
        >
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Design Your Dream Vacation
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-1">
              Customize every detail of your journey with complete flexibility,
              from arrival to departure. Tailor your trip to fit your
              preferences by choosing:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 md:gap-4 lg:gap-x-12 my-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center bg-yellow-50 p-2 rounded-lg sm:rounded-xl text-center"
              >
                <div className="flex flex-row">
                  <div className="px-2">{feature.icon}</div>
                  <p className="text-sm sm:text-base font-medium text-gray-700">
                    {feature.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <a
                href="/customize"
                className="inline-block bg-amber-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 text-sm sm:text-base mt-2"
              >
                Customize Your Own Plan
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
