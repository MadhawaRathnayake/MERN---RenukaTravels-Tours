import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import welcomeImg from "../images/Welcome.jpg";

export default function DestinationHome() {
  const { destSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [destination, setDestination] = useState(null);
  const [destinationNames, setDestinationNames] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(false);
  const navigate = useNavigate();

  const ImageSlider = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const prevSlide = () => {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
      const isLastSlide = currentIndex === slides.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
      setCurrentIndex(slideIndex);
    };

    const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [slides.length]);

    return (
      <>
        <div className="mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[400px] rounded-xl overflow-hidden group"
          >
            {/* Navigation Buttons */}
            <div className="hidden group-hover:block absolute top-1/2 left-5 -translate-y-1/2 z-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-all">
              <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>
            <div className="hidden group-hover:block absolute top-1/2 right-5 -translate-y-1/2 z-10 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-all">
              <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div>
            
            {/* Image Container */}
            <motion.div 
              animate={{ scale: 1.05 }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              style={{ backgroundImage: `url(${slides[currentIndex]})` }}
              className="w-full h-full bg-center bg-cover cursor-pointer"
              onClick={toggleFullScreen}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          </motion.div>
          
          <div className="flex justify-center mt-4 space-x-3">
            {slides.map((slide, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === slideIndex ? "bg-amber-500 scale-125" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </div>

        {isFullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="relative w-full h-full flex justify-center items-center">
              <img
                src={slides[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-5 right-5 text-white text-3xl hover:text-amber-400 transition-colors duration-300"
                onClick={toggleFullScreen}
              >
                <AiOutlineClose />
              </button>
              <button
                className="absolute top-1/2 left-5 -translate-y-1/2 text-3xl text-white hover:text-amber-400 transition-colors duration-300"
                onClick={prevSlide}
              >
                <BsChevronCompactLeft size={40} />
              </button>
              <button
                className="absolute top-1/2 right-5 -translate-y-1/2 text-3xl text-white hover:text-amber-400 transition-colors duration-300"
                onClick={nextSlide}
              >
                <BsChevronCompactRight size={40} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

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
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchDestinationNames();
  }, []);

  useEffect(() => {
    if (destination?.destinationName) {
      const fetchHotels = async () => {
        try {
          setHotelLoading(true);
          const res = await fetch(
            `/api/hotels/hotels?city=${destination.destinationName}`
          );
          const data = await res.json();
          if (!res.ok) {
            setHotelError(true);
            setHotelLoading(false);
            return;
          }
          setHotels(data);
          setHotelLoading(false);
        } catch (error) {
          setHotelError(true);
          setHotelLoading(false);
        }
      };
      fetchHotels();
    }
  }, [destination]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load the destination information.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
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
            style={{ backgroundImage: `url(${welcomeImg})` }}
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
                Discover <span className="text-amber-400">Sri Lanka</span>
              </h1>
              <p className="text-white text-lg md:text-xl max-w-3xl mb-10">
                Explore the breathtaking landscapes, rich cultural heritage, and unforgettable experiences across this beautiful island paradise.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center flex-wrap gap-3 max-w-4xl"
            >
              {destinationNames.slice(0, 6).map((dest, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/destinations/${dest.slug}`)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/30 text-white hover:bg-white/40 transition-all duration-300"
                >
                  <span>{dest.name}</span>
                </button>
              ))}
              {destinationNames.length > 6 && (
                <button
                  onClick={() => {
                    document.getElementById('all-destinations')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-400 text-white hover:bg-amber-500 transition-all duration-300"
                >
                  <span>View All</span>
                </button>
              )}
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 z-50 sm:px-6 lg:px-8 py-16">
        

        <div className="bg-white rounded-xl shadow-lg -mt-32 relative z-10 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Description Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-2/3 p-8 lg:p-12"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold ml-4 text-gray-800">About Sri Lanka</h2>
              </div>
              
              <div
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: `<p>	Sri Lanka, an island nation in the Indian Ocean, is a <strong>paradise for travelers</strong> seeking diverse experiences. Known for its stunning landscapes, the country offers a rich tapestry of <strong>cultural heritage and natural beauty</strong>.</p><p><br></p><p>	One of the highlights is the <strong>Ancient City of Sigiriya</strong>, a UNESCO World Heritage site featuring a magnificent rock fortress that dates back to the 5th century. The city of <strong>Kandy</strong>, home to the <strong>Temple of the Sacred Tooth Relic</strong>, is another cultural gem, where visitors can immerse themselves in Buddhist traditions.</p><p><br></p><p>	For nature lovers, the <strong>Yala National Park</strong> presents a chance to spot majestic wildlife, including leopards and elephants, amidst lush scenery. <strong>Unawatuna Beach</strong> and <strong>Mirissa</strong> are perfect for sun-seekers, offering pristine sands and vibrant marine life for snorkeling enthusiasts.</p><p><br></p><p>	With its <strong>breathtaking landscapes, rich history, and warm hospitality</strong>, Sri Lanka is a captivating destination that promises unforgettable adventures.</p>`,
                }}
              />
            </motion.div>

            {/* Other Destinations Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/3 bg-gray-50 p-8 lg:p-12 flex flex-col justify-center"
              id="all-destinations"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Explore All Destinations</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
                {destinationNames
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((dest, index) => (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      key={index}
                      onClick={() => navigate(`/destinations/${dest.slug}`)}
                      className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:scale-102 transition-all duration-300 text-gray-900 text-left group flex items-center justify-between"
                    >
                      <span className="font-medium">{dest.name}</span>
                      <svg
                        className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image Slider */}
        {destination?.additionalImages?.length > 0 && (
          <ImageSlider slides={destination.additionalImages} />
        )}
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Explore Sri Lanka?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Discover the perfect destination for your next adventure and create memories that will last a lifetime.
          </p>
          <a href="/tours">
            <button className="bg-white text-amber-500 font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Browse Our Tours
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}