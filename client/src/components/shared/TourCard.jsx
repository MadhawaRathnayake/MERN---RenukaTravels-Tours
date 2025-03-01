/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BsClock, BsArrowRight } from "react-icons/bs";

const TourCard = ({ tour }) => {
  const { _id, title, photo, days } = tour;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
    >
      {/* Image container with overlay effect - fixed height */}
      <div className="relative overflow-hidden h-48 sm:h-52 md:h-56">
        <img 
          src={photo} 
          alt={title} 
          className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
        />
        
        {/* Days badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
            <BsClock className="text-amber-500" />
            <span className="text-sm font-medium text-gray-800">{days} Days</span>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content - with flex grow to push button to bottom */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3rem]">
          <Link
            to={`/tours/${_id}`}
            className="hover:text-amber-500 transition-colors duration-200"
          >
            {title}
          </Link>
        </h3>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        <div className="flex items-center justify-between mt-3">
          {/* Book Now button */}
          <Link 
            to={`/tours/${_id}`}
            className="inline-flex items-center gap-2 text-amber-500 font-semibold group/btn hover:text-amber-600 transition-colors"
          >
            <span>Book Now</span>
            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;