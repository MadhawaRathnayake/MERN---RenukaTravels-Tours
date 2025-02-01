import React from "react";
import { Link } from "react-router-dom";

const TourCard = ({ tour }) => {
  const { _id, title, photo, desc, days, destinations } = tour;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img src={photo} alt={title} className="w-full h-48 object-cover " />
      </div>
      <div className="p-4">
        <h5 className="text-xl font-semibold text-gray-800 mb-2">
          <Link to={`/tours/${_id}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h5>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            <i className="ri-time-line mr-1"></i> {days} Days
          </span>
          <button className="text-blue-500 font-medium hover:underline">
            <Link to={`/tours/${_id}`}>Book Now</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
