import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DestinationDetails() {
  const { destSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [destination, setDestination] = useState(null);
  const [destinationNames, setDestinationNames] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/destination/get-dest/?slug=${destSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setDestination(data.destinations[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [destSlug]);

  useEffect(() => {
    const fetchDestinationNames = async () => {
      try {
        const res = await fetch(`/api/destination/get-dest`);
        const data = await res.json();
        if (res.ok) {
          const names = data.destinations.map((destination) => ({
            name: destination.destinationName,
            slug: destination.slug,
          }));
          setDestinationNames(names);
        } else {
          console.log("Error fetching destinations");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchDestinationNames();
  }, []);

  useEffect(() => {
    if (destination && destination.destinationName) {
      const fetchHotels = async () => {
        try {
          setHotelLoading(true);
          // Fetch hotels by city corresponding to the destination name
          const res = await fetch(
            `/api/hotels/hotels?city=${destination.destinationName}`
          );
          const data = await res.json();
          if (!res.ok) {
            setHotelError(true);
            setHotelLoading(false);
            return;
          }
          setHotels(data); // Assuming data is an array of hotels
          setHotelLoading(false);
        } catch (error) {
          setHotelError(true);
          setHotelLoading(false);
        }
      };
      fetchHotels();
    }
  }, [destination]);

  const handleNavigate = (slug) => {
    navigate(`/destinations/${slug}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="w-full flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/renuka-travels.appspot.com/o/Destinations-Cover-Image.jpg?alt=media&token=0062a4f0-eabd-4e8e-9f9f-9e6332953d60")`,
          height: "400px",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <h1 className="text-3xl font-semibold  mt-72 relative text-white z-10">
          {destination && destination.destinationName}
        </h1>
      </div>

      <div className="w-full flex my-12">
        <div className="w-1/2">
          <h1 className="text-3xl mb-8 font-semibold">
            {destination && destination.destinationName}
          </h1>
          <div
            className="flex flex-col items-center mx-10 text-lg"
            dangerouslySetInnerHTML={{ __html: destination.description }}
          ></div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <img src={destination.destImage} alt="" />
        </div>
      </div>

      {/* Conditional rendering for the hotels section */}
      {destination && destination.destinationName !== "Sri Lanka" && (
        <>
          <button className="bg-[#F4AC20] text-white font-semibold py-2 px-4 rounded">
            Hotels in {destination.destinationName}
          </button>

          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotelLoading ? (
              <Spinner size="lg" />
            ) : hotelError ? (
              <p>Failed to load hotels. Please try again later.</p>
            ) : hotels.length > 0 ? (
              hotels.map((hotel) => (
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
                      <button
                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                        className="bg-[#F4AC20] hover:bg-[#e2b04a] text-white font-bold py-2 rounded"
                        style={{ width: "128px", padding: "0.5rem 1rem" }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No hotels available for this destination.</p>
            )}
          </div>
        </>
      )}

      <button className="bg-[#F4AC20] text-white font-semibold py-2 px-4 rounded">
        Other Destinations
      </button>

      <div className="max-w-full overflow-x-auto">
        <div className="flex space-x-4 py-4">
          {destinationNames.length > 0 ? (
            destinationNames.map((destination, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(destination.slug)}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 whitespace-nowrap"
              >
                {destination.name}
              </button>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
