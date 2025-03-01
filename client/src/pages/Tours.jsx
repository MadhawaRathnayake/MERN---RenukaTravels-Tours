import { useState, useEffect } from "react";
import TourCard from "../components/shared/TourCard";
import "../styles/global.css";
import { motion } from "framer-motion";

// Import slide images
import sec01 from "../images/sec01-01.jpg";
import sec02 from "../images/sec01-02.jpg";
import sec03 from "../images/sec01-03.jpg";
import sec04 from "../images/sec01-04.jpg";
import sec05 from "../images/sec01-05.jpg";

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const images = {
    slides1: [sec01, sec02, sec03, sec04, sec05],
  };

  const [slideIndex, setSlideIndex] = useState({
    slides1: 0,
  });

  // Categories for filtering (you can modify these based on your actual tour categories)
  const categories = [
    { id: "adventure", title: "Adventure" },
    { id: "cultural", title: "Cultural" },
    { id: "beach", title: "Beach" },
    { id: "wildlife", title: "Wildlife" },
    { id: "heritage", title: "Heritage" },
    { id: "family", title: "Family" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => ({
        slides1: (prev.slides1 + 1) % images.slides1.length,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fetch tours data
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tours/gettours?page=${page}`);
        const data = await res.json();

        if (res.ok) {
          setTours(data.tours);

          const pages = Math.ceil((data.totalTours || 0) / 8); // Assuming 8 items per page
          setPageCount(pages);
        } else {
          setError(data.message || "Failed to fetch tours");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            animate={{ scale: 1.05 }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              backgroundImage: `url(${images.slides1[slideIndex.slides1]})`,
            }}
            className="w-full h-full bg-center bg-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center h-full pt-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Featured <span className="text-amber-400">Tours</span>
              </h1>
              <p className="text-white text-lg md:text-xl max-w-3xl mb-10">
                Explore our handpicked selection of exclusive tours designed to showcase the very best of Sri Lanka's natural beauty and cultural heritage.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center flex-wrap gap-3 max-w-4xl"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === category.id 
                      ? "bg-white/30 text-white  shadow-lg  " 
                      : "bg-white/30 text-white "
                  }`}
                >
                  <span>{category.title}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </div>

      {/* Tours Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {tours?.map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TourCard tour={tour} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && pageCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mt-12"
          >
            <div className="flex space-x-2">
              {[...Array(pageCount).keys()].map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    page === number
                      ? "bg-amber-500 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Can't Find the Perfect Tour?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Let us create a custom itinerary tailored to your preferences. Our travel experts will design the perfect Sri Lankan experience just for you.
          </p>
          <a href="/customize">
            <button className="bg-white text-amber-500 font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Design Your Own Tour
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Tours;