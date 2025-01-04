import React from 'react';
import TourCard from '../shared/TourCard';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';

const FeaturedTourList = () => {
  const { data: tours, loading, error } = useFetch(`${BASE_URL}/tours/gettours`);

  return (
    <div className="flex flex-wrap -mx-2">
      {loading && (
        <div className="w-full text-center py-5">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      )}
      {error && (
        <div className="w-full text-center py-5">
          <p className="text-lg font-semibold text-red-500">{error}</p>
        </div>
      )}
      {!loading && !error && tours?.map((tour) => (
        <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4" key={tour._id}>
          <TourCard tour={tour} />
        </div>
      ))}
    </div>
  );
};

export default FeaturedTourList;
