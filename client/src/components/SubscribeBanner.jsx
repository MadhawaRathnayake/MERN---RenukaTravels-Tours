import React from "react";
import maleTourist from "../images/male-tourist.png";

const SubscribeBanner = () => {
  return (
    <section className="bg-blue-100 mt-12 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <div className="mb-4">
            <span className="bg-[#F4AC20] text-white font-bold px-3 py-1 rounded">
              GALLERY
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-8">
            Subscribe now to get <span className="text-[#F4AC20]">useful </span>
            traveling <span className="text-[#F4AC20]">information</span>
          </h2>
          <div className="flex items-center bg-white rounded-lg shadow-md p-2 mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow border-none text-lg p-2 focus:outline-none"
            />
            <button className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg">
              Subscribe
            </button>
          </div>
          <p className="text-gray-700 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
            obcaecati beatae iure facilis, veritatis possimus.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img src={maleTourist} alt="Male Tourist" className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default SubscribeBanner;
