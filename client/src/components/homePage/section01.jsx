/*****************************************************************************************************************************/
/*
                                        Instruction for Removing the Under Construction Banner

    * Delete useState const, (don't delete currenctUser const)
    * Delete use effect and handleColse functions
    * Remove className="relative" part in the <Section>
    * Delete the section01.css file

*/
/*****************************************************************************************************************************/

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
  
  // Slider controls
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Features data
  const features = [
    { icon: <HiOutlineLocationMarker className="text-amber-500 text-2xl" />, text: "Destinations" },
    { icon: <FaRoute className="text-amber-500 text-2xl" />, text: "Travel Route" },
    { icon: <FaHotel className="text-amber-500 text-2xl" />, text: "Accommodation" },
    { icon: <FaCar className="text-amber-500 text-2xl" />, text: "Transportation" },
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            animate={{ scale: 1.05 }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              backgroundImage: `url(${slides[currentIndex]})`,
            }}
            className="w-full h-full bg-center bg-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center h-full pt-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                It's a Big World Out There,{" "}
                <span className="text-amber-400">Go Explore</span>
              </h1>
              <p className="text-white text-lg md:text-xl max-w-3xl mb-10">
                Dreaming of an unforgettable trip to Sri Lanka? Discover hidden
                gems, plan your itinerary, explore top hotels, and manage your
                budget with ease. Start crafting your personalized
                Sri Lankan adventure today!
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
                  className="inline-block bg-amber-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300"
                >
                  Get Started
                </a>
              </motion.div>
            )}
            
            {/* Image Navigation */}
            <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </div>

      {/* Features Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  -mt-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-4 bg-white rounded-2xl shadow-xl p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Design Your Dream Vacation
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Customize every detail of your journey with complete flexibility, from arrival to departure.
              Tailor your trip to fit your preferences by choosing:
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center bg-amber-50 rounded-xl p-6 text-center"
              >
                <div className="mb-3">
                  {feature.icon}
                </div>
                <p className="font-medium text-gray-700">{feature.text}</p>
              </motion.div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <a 
                href="/customize" 
                className="inline-block bg-amber-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300"
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