import React, { useState, useEffect } from "react";
import { Search, ZoomIn } from "lucide-react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const imagesPerPage = 10;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        setImages(data);
        setDisplayedImages(data.slice(0, imagesPerPage));
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const loadMoreImages = () => {
    const nextPage = page + 1;
    const startIndex = page * imagesPerPage;
    const endIndex = nextPage * imagesPerPage;
    const nextImages = images.slice(startIndex, endIndex);
    
    setDisplayedImages([...displayedImages, ...nextImages]);
    setPage(nextPage);
  };

  if (loading) {
    return (
      <section className="mt-8 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 w-full rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <Search className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No Images Found</h3>
        <p className="text-gray-500 mt-2">Check back later for new additions!</p>
      </div>
    );
  }

  return (
    <section className="mt-8 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Masonry Layout with Responsive Columns */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{
            gridAutoRows: "15px",
          }}
        >
          {displayedImages.map((image, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-gray-100"
              style={{
                gridRowEnd: `span ${Math.ceil(Math.random() * 12 + 5)}`,
              }}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.imageURL}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
        
        {/* See More Button */}
        {displayedImages.length < images.length && (
          <div className="flex justify-center mt-8">
            
            <button 
              onClick={loadMoreImages}
              className="w-full text-teal-500 text-sm py-4 hover:underline"
            >
              See more...
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <img
              src={selectedImage.imageURL}
              alt="Selected image"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <span className="text-3xl">&times;</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}