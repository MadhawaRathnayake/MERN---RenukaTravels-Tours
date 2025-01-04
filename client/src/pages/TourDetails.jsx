import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';

const TourDetails = () => {
  const { id } = useParams();

  // Fetch data from database
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/gettour/${id}`);
  console.log(tour);

  // Destructure properties from tour object
  const { title, destinations, days, photo, desc } = tour || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  return (
    <section className="py-8">
      <div className="container mx-auto">
        {loading && <h4 className="text-center pt-5 text-lg font-semibold">Loading.....</h4>}
        {error && <h4 className="text-center pt-5 text-lg font-semibold text-red-500">{error}</h4>}
        {!loading && !error && (
          <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12">
              <div className="tour__content bg-white shadow-md rounded-md p-6">
                {photo && (
                  <img
                    src={photo}
                    alt={title}
                    className="w-full h-72 object-cover rounded-md mb-6"
                  />
                )}
                <div className="tour__info">
                  <h2 className="text-2xl font-bold mb-4">{title}</h2>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="text-sm font-medium text-gray-600">
                      <strong>Days:</strong> {days}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      <strong>Destinations:</strong> {destinations?.length || 0} places
                    </span>
                  </div>
                  <h5 className="text-lg font-semibold mb-2">Description</h5>
                  <p className="text-gray-700">{desc}</p>
                </div>
              </div>
            </div>

            {/* Uncomment when Booking component is available */}
            {/* <div className="w-full lg:w-4/12 mt-6 lg:mt-0">
              <Booking tour={tour} />
            </div> */}
          </div>
        )}
      </div>
    </section>
  );
};

export default TourDetails;
