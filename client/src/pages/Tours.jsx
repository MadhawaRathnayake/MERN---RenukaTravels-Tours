import { useState, useEffect } from "react";
import TourCard from "../components/shared/TourCard";
import "../styles/global.css";

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

  const images = {
    slides1: [sec01, sec02, sec03, sec04, sec05],
  };

  const [slideIndex, setSlideIndex] = useState({
    slides1: 0,
  });

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
    <section>
      <div className="relative h-80 w-full">
        <div className="absolute inset-0">
          <div
            style={{
              backgroundImage: `url(${images.slides1[slideIndex.slides1]})`,
            }}
            className="w-full h-full bg-center bg-cover duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-5xl font-bold text-white mb-4">Featured Tours</h1>
          </div>
        </div>
      </div>
      
      <div className="basic-struture">
        <section>
          <div className="container mx-auto px-4">
            {/* Add search/filter functionality here if needed */}
          </div>
        </section>
        <section className="pt-0 mt-3">
          <div className="container mx-auto px-4">
            {loading && <h4 className="text-center py-5">Loading...</h4>}
            {error && (
              <h4 className="text-center py-5 text-red-500">{error}</h4>
            )}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tours?.map((tour) => (
                    <TourCard tour={tour} key={tour._id} />
                  ))}
                </div>

                <div className="flex justify-center mt-6 gap-2">
                  {[...Array(pageCount).keys()].map((number) => (
                    <span
                      key={number}
                      onClick={() => setPage(number)}
                      className={`cursor-pointer px-3 py-1 border rounded ${
                        page === number
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Tours;
