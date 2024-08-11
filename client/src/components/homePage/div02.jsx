import React from "react";
import div02cover from "../../images/div02-cover.png";

const Div02 = () => {
  return (
    <section className="bg-blue-100 mt-12 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 rounded-md">
          <img src={div02cover} alt="cover.img" className="w-full" />
        </div>
        <div className="lg:w-1/2 text-center lg:text-left lg:mb-0 pr-4 px-8">
          <p className="text-amber-500 pb-4">What we serve</p>
          <h2 className="text-5xl font-Aclonica pb-4">
            The Best And Most trusted
            <span className="text-[#F4AC20]"> Service</span>
          </h2>
          <p className="pb-4">
            We are the largest holiday service provider in the world with
            partners and places spread all over the world by prioritizing
            service and customer satisfaction.
          </p>
          <div className="pb-4">
            <button className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]">
              Learn more
            </button>
          </div>
          <div className="flex">
            <div className="pr-16 ">
              <h2 className="text-amber-400 text-3xl w-24 text-center">200+</h2>
              <div className="w-24 text-gray-400 text-center">Customer & partners</div>
            </div>
            <div className="pr-16">
              <h2 className="text-amber-400 text-3xl w-24 text-center">50+</h2>
              <div className="w-24 text-gray-400 text-center">Countries in the world</div>
            </div>
            <div className="pr-16">
              <h2 className="text-amber-400 text-3xl  w-24 text-center">100+</h2>
              <div className="w-24 text-gray-400 text-center">Success Journey</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Div02;
