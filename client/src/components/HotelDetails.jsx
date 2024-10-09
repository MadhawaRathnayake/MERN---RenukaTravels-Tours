import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/hotels/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setHotel(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-xl">Error: {error}</div>
    );

  return (
    <div className="container mx-auto p-4">
      {hotel && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div className="rounded-lg shadow-lg overflow-hidden">
            <img
              src={hotel.coverPhoto}
              alt={hotel.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{hotel.name}</h1>
            <p className="text-lg text-gray-500">{hotel.city}</p>
            <p className="text-md leading-relaxed text-gray-600">
              {hotel.description}
            </p>
            <div className="text-lg font-semibold flex items-center">
              <span className="mr-2">Rating:</span>
              <span className="text-[#F4AC20]">{`${hotel.rating}/5`}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelDetails;
