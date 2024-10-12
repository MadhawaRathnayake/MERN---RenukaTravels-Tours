import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function DestinationDetails() {
  const { destSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [destination, setdestination] = useState(null);
  const [destinationNames, setDestinationNames] = useState([]);
  console.log(destination);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(destSlug);
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
        if (res.ok) {
          setdestination(data.destinations[0]);
          setLoading(false);
          setError(false);
        }
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
            slug: destination.slug, // Assuming each destination has a 'slug' field
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

  const handleNavigate = (slug) => {
    navigate(`/destinations/${slug}`); // Navigating to the destination's page
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
        className="w-full flex flex-col lg:items-center md:items-center sm:items-center items-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/renuka-travels.appspot.com/o/Destinations-Cover-Image.jpg?alt=media&token=0062a4f0-eabd-4e8e-9f9f-9e6332953d60")`,
          height: "400px",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <h1 className="text-3xl font-semibold font-serif mt-72 relative text-white z-10">
          {destination && destination.destinationName}
        </h1>
      </div>

      <div className="w-full flex my-12">
        <div className="w-1/2">
          <h1 className="text-3xl mb-8 font-serif font-semibold">
            {destination && destination.destinationName}
          </h1>
          <div
            className="flex flex-col lg:items-center md:items-center sm:items-center items-center mx-10 text-lg"
            dangerouslySetInnerHTML={{ __html: destination.description }}
          ></div>
        </div>
        <div className="w-1/2 flex flex-col lg:items-center md:items-center sm:items-center items-center justify-center">
          <img src={destination.destImage} alt="" />
        </div>
      </div>
      <h3 className="text-teal-500 font-semibold">Other Destinations :</h3>
      <div className="max-w-full overflow-x-auto">
        {/* Horizontal scrollable container */}
        <div className="flex space-x-4 py-4">
          {destinationNames.length > 0 ? (
            destinationNames.map((destination, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(destination.slug)} // Add onClick handler to navigate
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
