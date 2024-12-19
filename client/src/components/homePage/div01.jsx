/* eslint-disable no-unused-vars */
import React from "react";
import homecover from "../../images/home-div01.png";
import { useSelector } from "react-redux";

const Div01 = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <section className="mt-8 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center md:items-center sm:items-center items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 pr-4">
          <h2 className="text-5xl mb-8 font-Aclonica">
            It’s a Big World Out There,{" "}
            <span className="text-[#F4AC20]">Go Explore </span>
          </h2>
          <p className="text-gray-700 text-lg">
            Dreaming of an unforgettable trip to Sri Lanka? Discover the hidden
            gems, plan your itinerary, explore top hotels, and manage your
            budget with ease. Sign up now to start crafting your personalized
            Sri Lankan adventure today!
          </p>
          {!currentUser && (
            <div className="py-5">
              <button className="bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]">
                <b className="text-xl">Sign Up</b>
              </button>
            </div>
          )}
        </div>
        <div className="lg:w-1/2 lg:h-full md:h-full rounded-md md:flex md:justify-center md:visible lg:visible h-0 invisible">
          <img src={homecover} alt="cover.img" className="lg:w-full md:w-1/2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-6 items-center">
        <div className="bg-white shadow-lg rounded-2xl flex flex-col lg:flex-row items-stretch pr-4">
          <div className="w-full lg:w-3/4 flex flex-col md:flex-row md:justify-around">
            <div className="flex-1 p-6">
              <h3 className="pb-2">Start From</h3>
              <select
                id="fromLocation"
                name="fromLocation"
                form="fromLocation"
                className="rounded-3xl border-amber-400 w-full"
              >
                <option value="bandaranaike">
                  Colombo Bandaranaike International Airport
                </option>
                <option value="mattala">
                  Mattala Rajapaksa International Airport
                </option>
                <option value="ratmalana">
                  Colombo International Airport Ratmalana
                </option>
              </select>
            </div>
            <div className="flex-1 p-6">
              <h3 className="pb-2">End From</h3>
              <select
                id="endLocation"
                name="endLocation"
                form="endLocation"
                className="rounded-3xl border-amber-400 w-full"
              >
                <option value="bandaranaike">
                  Colombo Bandaranaike International Airport
                </option>
                <option value="mattala">
                  Mattala Rajapaksa International Airport
                </option>
                <option value="ratmalana">
                  Colombo International Airport Ratmalana
                </option>
              </select>
            </div>
            <div className="flex-1 p-6">
              <h3 className="pb-2">How many Days</h3>
              <form action="">
                <input
                  type="text"
                  className="rounded-3xl border-amber-400 w-full"
                  placeholder="How many days"
                />
              </form>
            </div>
          </div>

          <div className="flex-1 lg:pt-8 lg:w-1/4 md:w-full md:flex md:justify-center md:pb-8 w-full flex justify-center pb-4">
            <a href="/mappage">
              <button className="bg-[#F4AC20] text-white py-4 px-6 rounded-lg hover:bg-[#f49120]">
                <b className="text-xl">Customize Your Own Plan</b>
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Div01;
