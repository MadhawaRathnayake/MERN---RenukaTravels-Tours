import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WriteReview from "./write";

const ReviewsSection = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [lastMonthRating, setLastMonthRating] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [reviewUsers, setReviewUsers] = useState({});

  // States for image modal and toggling review mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [isWriteReviewMode, setIsWriteReviewMode] = useState(false);

  // Modified state to control how many reviews to display - initially showing 2
  const [reviewsLimit, setReviewsLimit] = useState(2);
  
  // New state for incremental loading
  const [loadIncrement, setLoadIncrement] = useState(2);
  const [reachedEnd, setReachedEnd] = useState(false);

  // New state for filtering by star rating (null means no filter)
  const [filterRating, setFilterRating] = useState(null);
  
  // Add missing states for the slider functionality
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  // Add sort state
  const [sortOption, setSortOption] = useState("newest");

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/review/getReviews");
      const reviewsData = response.data.reviews || [];

      // Overall average rating
      const totalRating = reviewsData.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating =
        reviewsData.length > 0
          ? (totalRating / reviewsData.length).toFixed(1)
          : 0;
      setAverageRating(avgRating);

      // Rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviewsData.forEach((review) => {
        if (review && typeof review.rating === 'number') {
          distribution[review.rating]++;
        }
      });
      setRatingDistribution(distribution);

      setReviews(reviewsData);

      // Compute last month rating
      const now = new Date();
      let lastMonth, lastMonthYear;
      if (now.getMonth() === 0) {
        lastMonth = 11;
        lastMonthYear = now.getFullYear() - 1;
      } else {
        lastMonth = now.getMonth();
        lastMonthYear = now.getFullYear();
      }
      const lastMonthReviews = reviewsData.filter((review) => {
        if (!review || !review.createdAt) return false;
        const reviewDate = new Date(review.createdAt);
        return (
          reviewDate.getMonth() === lastMonth &&
          reviewDate.getFullYear() === lastMonthYear
        );
      });
      if (lastMonthReviews.length > 0) {
        const totalLastMonthRating = lastMonthReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgLastMonth = (
          totalLastMonthRating / lastMonthReviews.length
        ).toFixed(1);
        setLastMonthRating(avgLastMonth);
      } else {
        setLastMonthRating(0);
      }

      // Fetch user data for each review
      if (reviewsData.length > 0) {
        const userPromises = reviewsData
          .filter(review => review && review.userId) // Filter out undefined or invalid reviews
          .map(async (review) => {
            try {
              const userResponse = await axios.get(`/api/user/${review.userId}`);
              return { userId: review.userId, data: userResponse.data };
            } catch (error) {
              console.error(`Error fetching user data for userId: ${review.userId}`, error);
              // Return a default user object if fetching fails
              return { userId: review.userId, data: { username: "Unknown User", profilePicture: null } };
            }
          });

        const users = await Promise.all(userPromises);
        const usersMap = users.reduce((acc, { userId, data }) => {
          if (userId) {
            acc[userId] = data;
          }
          return acc;
        }, {});

        setReviewUsers(usersMap);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Set reviews to empty array if fetch fails
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    // Optionally, set up polling for real-time updates:
    const interval = setInterval(fetchReviews, 8000); // every 8 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (!isExpanded && sortedReviews && sortedReviews.length > 0) {
      // Start auto slide
      startAutoSlide();
      
      // Clear interval when component unmounts or when expanded
      return () => {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
      };
    }
  }, [isExpanded, reviews, filterRating, sortOption]); // Added sortOption to dependencies

  const startAutoSlide = () => {
    // Clear any existing interval
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    
    // Set new interval for auto sliding
    autoSlideIntervalRef.current = setInterval(() => {
      if (!isExpanded && sortedReviews.length > 0) {
        // Advance to next slide or go back to first
        const nextSlideIndex = (currentSlide + 1) % sortedReviews.length;
        setCurrentSlide(nextSlideIndex);
        
        // Update slider position
        if (sliderRef.current) {
          sliderRef.current.style.transform = `translateX(-${nextSlideIndex * 100}%)`;
        }
      }
    }, 5000); // Auto slide every 5 seconds
  };

  // Add navigation functions for the slider
  const nextSlide = () => {
    if (currentSlide < sortedReviews.length - 1) {
      setCurrentSlide(currentSlide + 1);
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(-${(currentSlide + 1) * 100}%)`;
      }
    }
    // Reset auto slide timer when manually navigating
    startAutoSlide();
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(-${(currentSlide - 1) * 100}%)`;
      }
    }
    // Reset auto slide timer when manually navigating
    startAutoSlide();
  };

  // This callback is passed to WriteReview to add the new review immediately.
  const addReview = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill={i < rating ? "#FBBF24" : "#E5E7EB"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.1033 2.56698C14.4701 1.82374 15.5299 1.82374 15.8967 2.56699L19.1757 9.21093C19.3214 9.50607 19.6029 9.71064 19.9287 9.75797L27.2607 10.8234C28.0809 10.9426 28.4084 11.9505 27.8149 12.5291L22.5094 17.7007C22.2737 17.9304 22.1662 18.2614 22.2218 18.5858L23.4743 25.8882C23.6144 26.7051 22.7569 27.3281 22.0233 26.9424L15.4653 23.4946C15.174 23.3415 14.826 23.3415 14.5347 23.4946L7.9767 26.9424C7.24307 27.3281 6.38563 26.7051 6.52574 25.8882L7.7782 18.5858C7.83384 18.2614 7.72629 17.9304 7.49061 17.7007L2.1851 12.5291C1.59159 11.9505 1.91909 10.9426 2.73931 10.8234L10.0713 9.75797C10.3971 9.71064 10.6786 9.50607 10.8243 9.21093L14.1033 2.56698Z" />
        </svg>
      );
    }
    return stars;
  };

  const openModal = (images, index) => {
    setModalImages(images);
    setModalCurrentIndex(index);
    setIsModalOpen(true);
    
    // Pause auto slide when modal is open
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImages([]);
    setModalCurrentIndex(0);
    
    // Resume auto slide when modal is closed
    if (!isExpanded) {
      startAutoSlide();
    }
  };

  // Handler for filtering reviews by star rating.
  const handleFilterRating = (rating) => {
    // Toggle filter: if the same rating is clicked, clear the filter.
    if (filterRating === rating) {
      setFilterRating(null);
    } else {
      setFilterRating(rating);
    }
    // Reset the reviews limit when filter changes.
    setReviewsLimit(2);
    setReachedEnd(false);
    setCurrentSlide(0);
    
    // Reset auto slide timer when filter changes
    startAutoSlide();
  };

  // Handler for "See All Reviews" button
  const handleSeeAllReviews = () => {
    setIsExpanded(true);
    setReviewsLimit(4); // Initially show 4 reviews when expanded
    setReachedEnd(sortedReviews.length <= 4); // Set reached end if there are 4 or fewer reviews
    
    // Pause auto slide when expanded view is active
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
  };

  // Handler for "Load More" button
  const handleLoadMore = () => {
    const newLimit = reviewsLimit + 2;
    setReviewsLimit(newLimit);
    
    // Check if we've reached the end of the reviews
    if (newLimit >= sortedReviews.length) {
      setReachedEnd(true);
    }
  };

  // Handler for "Show Less" button
  const handleShowLess = () => {
    setIsExpanded(false);
    setReviewsLimit(2);
    setReachedEnd(false);
    setCurrentSlide(0);
    
    // Resume auto slide when going back to collapsed view
    startAutoSlide();
  };

  // Handler for sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentSlide(0);
    
    // Reset auto slide timer when sort changes
    if (!isExpanded) {
      startAutoSlide();
    }
  };

  // Apply filtering based on the selected star rating.
  const filteredReviews = filterRating
    ? reviews.filter((review) => review && review.rating === filterRating)
    : reviews;
  
  // Apply sorting based on the selected sort option
  const sortedReviews = [...filteredReviews]
    .filter(review => review && review.rating) // Make sure we only have valid reviews
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "relevance":
        default:
          // For relevance, we can combine recency and rating
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          const now = new Date();
          // Calculate a relevance score - higher is more relevant
          // Weight recent reviews and high ratings more
          const scoreA = (a.rating * 0.6) + (1 - ((now - dateA) / (1000 * 60 * 60 * 24 * 30))) * 0.4;
          const scoreB = (b.rating * 0.6) + (1 - ((now - dateB) / (1000 * 60 * 60 * 24 * 30))) * 0.4;
          return scoreB - scoreA;
      }
    });
  
  const displayedReviews = isExpanded 
    ? sortedReviews.slice(0, reviewsLimit)
    : sortedReviews; // Remove slice in non-expanded mode

  return (
    <section className="py-12 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
        <div>
          <h2 className="font-manrope font-bold text-3xl sm:text-4xl leading-10 text-black mb-8 text-center">
            Customer <span className="text-yellow-400">Reviews</span> &amp;
            Rating
          </h2>

          <div className="grid grid-cols-12 mb-11">
            <div className="col-span-12 xl:col-span-4 flex items-center">
              <div className="box flex flex-col gap-y-4 w-full max-xl:max-w-3xl mx-auto">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    onClick={() => handleFilterRating(rating)}
                    className="flex items-center w-full cursor-pointer"
                  >
                    <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                      {rating}
                    </p>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                        fill="#FBBF24"
                      />
                    </svg>
                    <div className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                      <div
                        className="h-full rounded-[30px] bg-indigo-500"
                        style={{
                          width: `${
                            reviews.length ? (ratingDistribution[rating] / reviews.length) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                      {ratingDistribution[rating]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle between summary view and WriteReview form */}
            <div className="col-span-12 max-xl:mt-8 xl:col-span-8 xl:pl-8 w-full min-h-[230px]">
              {isWriteReviewMode ? (
                <WriteReview
                  onCancel={() => setIsWriteReviewMode(false)}
                  onReviewSubmitted={addReview}
                />
              ) : (
                <div className="grid grid-cols-12 h-full px-8 max-lg:py-8 rounded-3xl bg-gray-100 w-full max-xl:max-w-3xl max-xl:mx-auto">
                  <div className="col-span-12 md:col-span-8 flex items-center">
                    <div className="flex flex-col sm:flex-row items-center max-lg:justify-center w-full h-full">
                      <div className="sm:pr-3 sm:border-r border-gray-200 flex items-center justify-center flex-col">
                        <h2 className="font-manrope font-bold text-5xl text-black text-center mb-4">
                          {averageRating}
                        </h2>
                        <div className="flex items-center gap-3 mb-4">
                          {renderStars(Math.round(averageRating))}
                        </div>
                        <p className="font-normal text-lg leading-8 text-gray-400">
                          {reviews.length} Ratings
                        </p>
                      </div>
                      <div className="sm:pl-3 sm:border-l border-gray-200 flex items-center justify-center flex-col">
                        <h2 className="font-manrope font-bold text-5xl text-black text-center mb-4">
                          {lastMonthRating}
                        </h2>
                        <div className="flex items-center gap-3 mb-4">
                          {renderStars(Math.round(lastMonthRating))}
                        </div>
                        <p className="font-normal text-lg leading-8 text-gray-400">
                          Last Month
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4 max-lg:mt-8 md:pl-8">
                    <div className="flex items-center flex-col justify-center w-full h-full">
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            navigate("/signin");
                          } else {
                            setIsWriteReviewMode(true);
                          }
                        }}
                        className="rounded-full px-6 py-4 bg-[#F4AC20] font-semibold text-lg text-white whitespace-nowrap mb-6 w-full text-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-[#f49120]"
                      >
                        Write A Review
                      </button>
                      <button
                        onClick={handleSeeAllReviews}
                        className="rounded-full px-6 py-4 bg-white font-semibold text-lg text-indigo-600 whitespace-nowrap w-full text-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-100 hover:shadow-indigo-200"
                      >
                        See All Reviews
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

           {/* Reviews Slider Section */}
           <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-manrope font-semibold text-2xl text-black">
                {filterRating ? `${filterRating}-Star Reviews` : "Latest Reviews"}
              </h3>
              
              {!isExpanded && sortedReviews.length > 1 && (
                <div className="flex items-center space-x-3 ">
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className={`rounded-full w-10 h-10 flex items-center justify-center ${currentSlide === 0 ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      onClick={nextSlide}
                      disabled={currentSlide >= sortedReviews.length - 1}
                      className={`rounded-full w-10 h-10 flex items-center justify-center ${currentSlide >= sortedReviews.length - 1 ? 'text-gray-300 bg-gray-100' : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

           {/* Reviews slider container */}
<div className={`${isExpanded ? '' : 'overflow-hidden'} relative rounded-2xl`}>
  <div 
    ref={sliderRef}
    className={`${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex transition-transform duration-500 ease-in-out'}`}
    style={{
      transform: isExpanded ? 'none' : `translateX(-${currentSlide * 50}%)`
    }}
  >
    {sortedReviews.length > 0 ? (
      displayedReviews.map((review, index) => {
        // Check if review and userId exist before trying to access them
        if (!review || !review.userId) {
          return null; // Skip invalid reviews
        }
                    
        const reviewUser = reviewUsers[review.userId] || {};
                    
        // When not expanded, use full width on mobile and half width on medium+ screens.
        return (
          <div
            key={review._id || index}
            className={`${isExpanded ? '' : 'min-w-full md:min-w-[50%] pr-6'}`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
              <div className="flex items-center gap-1 mb-4">
                {renderStars(review.rating)}
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={reviewUser.profilePicture || "https://via.placeholder.com/150"}
                    alt={reviewUser.username || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h6 className="font-semibold text-indigo-600">
                      {reviewUser.username || "Anonymous"}
                    </h6>
                    <p className="text-xs text-gray-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {review.comment || "No comment provided"}
              </p>
              
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {review.images.map((imgUrl, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={imgUrl}
                      alt={`Review image ${imgIndex + 1}`}
                      className="w-16 h-16 object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
                      onClick={() => openModal(review.images, imgIndex)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <div className="bg-white rounded-2xl p-8 text-center w-full shadow-sm">
        <p className="text-gray-500">No reviews available</p>
      </div>
    )}
  </div>
</div>

            {/* Load More / Show Less Controls */}
            {isExpanded && sortedReviews.length > 0 && (
              <div className="mt-8 text-center">
                {reachedEnd ? (
                  <>
                    <p className="text-gray-500 mb-4">You've reached all the reviews</p>
                    <button
                      onClick={handleShowLess}
                      className="rounded-full px-8 py-3 bg-yellow-400 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700"
                    >
                      Show Less
                    </button>
                  </>
                ) : (
                  displayedReviews.length < sortedReviews.length && (
                    <button
                      onClick={handleLoadMore}
                      className="rounded-full px-8 py-3 bg-yellow-400 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700"
                    >
                      Load More
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Review statistics and sorting controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
            <p className="font-normal text-gray-600 mb-4 sm:mb-0">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              {filterRating ? ` (${filteredReviews.length} with ${filterRating} stars)` : ''}
            </p>
            
            <div className="relative">
              <label className="font-normal text-gray-600 mr-3">Sort by:</label>
              <select 
                className="py-2 pl-3 pr-10 border border-gray-300 rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 appearance-none cursor-pointer"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl max-h-screen p-4">
            <button
              className="absolute top-0 right-0 text-white text-3xl bg-black bg-opacity-50 w-10 h-10 flex items-center justify-center rounded-full z-10"
              onClick={closeModal}
            >
              &times;
            </button>
            
            <div className="relative">
              <button
                onClick={() => setModalCurrentIndex((modalCurrentIndex - 1 + modalImages.length) % modalImages.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 w-12 h-12 flex items-center justify-center rounded-full"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <img
                src={modalImages[modalCurrentIndex]}
                alt="Review"
                className="max-h-[80vh] mx-auto object-contain rounded-lg"
              />
              
              <button
                onClick={() => setModalCurrentIndex((modalCurrentIndex + 1) % modalImages.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 w-12 h-12 flex items-center justify-center rounded-full"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-white">
                {modalCurrentIndex + 1} / {modalImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;