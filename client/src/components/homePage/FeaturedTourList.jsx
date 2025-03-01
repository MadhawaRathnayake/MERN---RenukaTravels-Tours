import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TourCard from '../shared/TourCard';
import { motion } from 'framer-motion';

const FeaturedTourList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tours data
  const fetchTours = async () => {
    try {
      const response = await axios.get("api/tours/gettours");
      setTours(response.data.tours || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Only take the first 4 tours
  const featuredTours = tours.slice(0, 4);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative">
      {/* More Tours Button */}
      <div className="absolute right-0 -top-12 hidden sm:block">
        <motion.button 
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/tours')}
          className="flex items-center gap-2 text-amber-500 hover:text-amber-600 font-medium transition-colors duration-300"
        >
          <span>More Tours</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading amazing destinations...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-6">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchTours}
            className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : featuredTours.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center my-6">
          <p className="text-gray-600 font-medium mb-2">No tours available at the moment</p>
          <p className="text-gray-500 text-sm">Check back soon for exciting new destinations!</p>
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {featuredTours.map((tour) => (
              <div key={tour._id} className="h-full">
                <TourCard tour={tour} />
              </div>
            ))}
          </motion.div>
          
          {/* Mobile-only more tours button */}
          <div className="mt-8 flex justify-center sm:hidden">
            <motion.button 
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/tours')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-3 rounded-full shadow-md transition-colors duration-300"
            >
              <span>View All Tours</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedTourList;