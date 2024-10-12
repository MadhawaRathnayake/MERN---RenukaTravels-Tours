import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HotelsList() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch(`/api/hotels`)
      .then((response) => response.json())
      .then((data) => setHotels(data))
      .catch((error) => console.error("Failed to fetch hotels:", error));
  }, []);

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="mb-6">
        <span className="bg-[#F4AC20] text-white font-bold px-3 py-1 rounded">
          HOTELS
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white"
          >
            <img
              className="w-full h-48 object-cover"
              src={hotel.hotelImageURL}
              alt={hotel.name}
            />
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-xl">{hotel.name}</div>
                <span className="text-[#F4AC20] text-xl flex items-center">
                  ⭐ {hotel.rating}
                </span>
              </div>
              <div className="flex justify-center">
                <Link
                  to={`/hotels/${hotel._id}`}
                  className="bg-[#F4AC20] hover:bg-[#e2b04a] text-white font-bold py-2 rounded text-center block"
                  style={{ width: "128px", padding: "0.5rem 1rem" }}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelsList;
