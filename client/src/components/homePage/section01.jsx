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
  
  const prevSlide = () => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  const nextSlide = () => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  const goToSlide = (slideIndex) => setCurrentIndex(slideIndex);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const features = [
    { icon: <HiOutlineLocationMarker className="text-amber-500 text-2xl" />, text: "Destinations" },
    { icon: <FaRoute className="text-amber-500 text-2xl" />, text: "Travel Route" },
    { icon: <FaHotel className="text-amber-500 text-2xl" />, text: "Accommodation" },
    { icon: <FaCar className="text-amber-500 text-2xl" />, text: "Transportation" },
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            style={{ backgroundImage: `url(${slides[currentIndex]})` }}
            className="w-full h-full bg-center bg-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <motion.h1 className="text-3xl md:text-6xl font-bold text-white mb-4">
            It's a Big World Out There, <span className="text-amber-400">Go Explore</span>
          </motion.h1>
          <p className="text-white text-base md:text-xl max-w-3xl mb-6 px-2">
            Discover hidden gems, plan your itinerary, explore hotels, and manage your budget with ease.
          </p>
          {!currentUser && (
            <motion.a 
              href="/signin"
              className="bg-amber-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300"
            >
              Get Started
            </motion.a>
          )}
          
          {/* Navigation Dots */}
          <div className="absolute bottom-4 flex gap-2">
            {slides.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <motion.div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
            Design Your Dream Vacation
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-6">
            Customize every detail of your journey with complete flexibility.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div key={index} className="flex flex-col items-center bg-amber-50 rounded-xl p-4 md:p-6 text-center">
                {feature.icon}
                <p className="font-medium text-gray-700 text-sm sm:text-base mt-2">{feature.text}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <motion.a 
              href="/customize" 
              className="bg-amber-500 text-white font-bold py-2 md:py-4 px-6 md:px-10 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300"
            >
              Customize Your Own Plan
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
