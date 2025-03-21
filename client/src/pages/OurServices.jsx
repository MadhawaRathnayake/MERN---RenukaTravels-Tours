import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Import slide images
import sec01 from "../images/sec01-01.jpg";
import sec02 from "../images/sec01-02.jpg";
import sec03 from "../images/sec01-03.jpg";
import sec04 from "../images/sec01-04.jpg";
import sec05 from "../images/sec01-05.jpg";

// Import food images
import food01 from "../images/service/food01.jpg";
import food02 from "../images/service/food02.jpg";

// Import hotel images
import hotel01 from "../images/service/hotel01.jpg";
import hotel02 from "../images/service/hotel02.jpg";
import hotel03 from "../images/service/hotel03.jpg";

// Import car images
import car01 from "../images/service/car01.jpeg";
import car02 from "../images/service/car02.jpeg";
import car03 from "../images/service/car03.jpeg";

// Import static images
import driver_img from "../images/service/Driver.png";
import car_img from "../images/service/Car.png";
import hotel_img from "../images/service/hotel.png";
import food_img from "../images/service/food.png";
import helicopter_img from "../images/service/helicopter.png";
import concierge_img from "../images/service/Concierge.png";
import driver_jpg from "../images/service/driver.jpg";
import helicopter_jpg from "../images/service/helicopter.jpg";
import contingence from "../images/service/contingence.jpg";

const images = {
  slides1: [sec01, sec02, sec03, sec04, sec05],
  slides2: [food01, food02],
  slides3: [hotel01, hotel02, hotel03],
  slides4: [car01, car02, car03],
  static: {
    driver: driver_img,
    car: car_img,
    hotel: hotel_img,
    food: food_img,
    helicopter: helicopter_img,
    concierge: concierge_img,
    driver_jpg,
    helicopter_jpg,
    contingence,
  },
};

const services = [
  {
    id: "food",
    title: "Food and Beverages",
    icon: images.static.food,
    description:
      "Sri Lanka is a culinary paradise, offering a fusion of bold flavors and global cuisines. From spicy local curries and fresh seafood to Indian, Chinese, Italian, Western, and Thai delights, every meal is an experience. Our expert chefs and mixologists ensure a perfect blend of taste and tradition, making your journey even more memorable.",
    slideKey: "slides2",
  },
  {
    id: "hotels",
    title: "Hotels and Villas",
    icon: images.static.hotel,
    description:
      "Experience the finest luxury accommodations in Sri Lanka, offering breathtaking views of mountains and oceans. Our handpicked hotels and villas provide world-class service, ensuring comfort, elegance, and an unforgettable stay.",
    slideKey: "slides3",
  },
  {
    id: "vehicles",
    title: "Vehicle Rental",
    icon: images.static.car,
    description:
      "Travel in style with our fleet of luxury vehicles, available with or without chauffeurs. Choose your ideal ride and explore Sri Lanka at your own pace, ensuring comfort and convenience throughout your journey.",
    slideKey: "slides4",
  },
  {
    id: "chauffeur",
    title: "Chauffeur Drive Services",
    icon: images.static.driver,
    description:
      "Enjoy a seamless journey with our professional chauffeur drive services. Our experienced and friendly chauffeurs ensure a safe, comfortable, and stress-free travel experience, allowing you to relax and explore Sri Lanka with ease.",
    image: images.static.driver_jpg,
  },
  {
    id: "concierge",
    title: "Concierge Services",
    icon: images.static.concierge,
    description:
      "Our concierge services ensure a hassle-free and personalized travel experience. From itinerary planning and reservations to exclusive experiences, we take care of every detail, so you can relax and enjoy your journey in Sri Lanka.",
    image: images.static.contingence,
  },
  {
    id: "helicopter",
    title: "Personal Helicopters",
    icon: images.static.helicopter,
    description:
      "Option for personal helicopters to make your travel experience quicker and more enjoyable. Not only do they save valuable time, but they also offer stunning aerial views of Sri Lanka's breathtaking landscapes, allowing you to see the country's beauty from a whole new perspective.",
    image: images.static.helicopter_jpg,
  },
];

const ServiceCard = ({ service, index, slideIndex }) => {
  const isEven = index % 2 === 0;

  const getImage = () => {
    if (service.slideKey) {
      return images[service.slideKey][slideIndex[service.slideKey]];
    }
    return service.image;
  };

  return (
    <motion.div
      id={service.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="mb-12"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div
          className={`flex flex-col ${
            isEven ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          <div className="lg:w-1/2 relative">
            <div className="h-64 lg:h-96 bg-center">
              <img
                src={getImage()}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent" />
          </div>

          <div className="lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center mb-4 lg:mb-6">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-amber-100 rounded-full flex items-center justify-center shadow-md">
                <img
                  src={service.icon}
                  alt=""
                  className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
                />
              </div>
              <h2 className="text-xl lg:text-3xl font-bold ml-3 lg:ml-4 text-gray-800">
                {service.title}
              </h2>
            </div>

            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              {service.description}
            </p>

            <div className="mt-6 lg:mt-8 self-start">
              {service.id === "vehicles" ? (
                <button className="px-4 py-2 lg:px-6 lg:py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm lg:text-base font-medium rounded-full transition-colors duration-300">
                  Learn More
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function OurServices() {
  const [slideIndex, setSlideIndex] = useState({
    slides1: 0,
    slides2: 0,
    slides3: 0,
    slides4: 0,
  });
  const [activeService, setActiveService] = useState(null);
  const [userTouched, setUserTouched] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => ({
        slides1: (prev.slides1 + 1) % images.slides1.length,
        slides2: (prev.slides2 + 1) % images.slides2.length,
        slides3: (prev.slides3 + 1) % images.slides3.length,
        slides4: (prev.slides4 + 1) % images.slides4.length,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveService(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    services.forEach((service) => {
      const element = document.getElementById(service.id);
      if (element) observer.observe(element);
    });

    return () => {
      services.forEach((service) => {
        const element = document.getElementById(service.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const scrollToService = (id) => {
    // Set touched state for mobile
    setUserTouched(true);
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      
      // Clear touched state after scrolling
      setTimeout(() => {
        setUserTouched(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: 1.05 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: `url(${images.slides1[slideIndex.slides1]})`,
            }}
            className="w-full h-full bg-center bg-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center h-full pt-10 md:pt-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6">
                Our Premium <span className="text-amber-400">Services</span>
              </h1>
              <p className="text-white text-base md:text-xl max-w-3xl mb-6 md:mb-10 px-2">
                Experience luxury travel throughout Sri Lanka with our
                comprehensive range of premium services tailored to your needs.
              </p>
            </motion.div>

            {/* Mobile Service buttons (only shown on small screens) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:hidden w-full px-2"
            >
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm mx-auto">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => scrollToService(service.id)}
                    onTouchStart={() => setUserTouched(true)}
                    onTouchEnd={() => setTimeout(() => setUserTouched(false), 500)}
                    className={`flex items-center justify-center space-x-1 px-2 py-1.5 rounded-full transition-all duration-300 ${
                      activeService === service.id && !userTouched
                        ? "bg-white/40 text-white shadow-lg"
                        : "bg-white/30 text-white hover:bg-amber-300"
                    }`}
                  >
                    <img
                      src={service.icon}
                      alt=""
                      className="w-5 h-5 object-contain filter invert sepia brightness-0 hue-rotate-180"
                    />
                    <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                      {service.title}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Desktop Service buttons (only shown on medium and larger screens) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:flex justify-center flex-wrap gap-3 max-w-4xl"
            >
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => scrollToService(service.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeService === service.id
                      ? "bg-white/30 text-white hover:bg-amber-300 shadow-lg transform scale-105"
                      : "bg-white/30 text-white hover:bg-amber-300"
                  }`}
                >
                  <img
                    src={service.icon}
                    alt=""
                    className="w-8 h-8 object-contain filter invert sepia brightness-0 hue-rotate-180"
                  />
                  <span>{service.title}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </div>

      {/* Services Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Luxury Travel Made Simple
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of premium services designed to
            make your Sri Lankan journey unforgettable. From gourmet cuisine to
            luxury accommodations and transportation, we've got every aspect of
            your travel experience covered.
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              slideIndex={slideIndex}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-6 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-sm md:text-lg text-white mb-6 md:mb-8 max-w-2xl mx-auto">
            Contact us today to customize your perfect Sri Lankan journey with
            our premium services tailored to your preferences.
          </p>
          <a href="/customize">
            <button className="bg-white text-amber-500 font-bold py-2.5 px-6 md:py-3 md:px-8 text-sm md:text-base rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Book Your Experience
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}