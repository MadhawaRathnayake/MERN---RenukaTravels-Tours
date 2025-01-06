import React, { useEffect, useState } from "react";
import homecover from "../../images/home-div01.png";
import { useSelector } from "react-redux";
import "./section01.css";

/*****************************************************************************************************************************/
/*
                                        Instruction for Removing the Under Construction Banner

    * Delete useState const, (don't delete currenctUser const)
    * Delete use effect and handleColse functions
    * Remove className="relative" part in the <Section>
    * Delete the section01.css file

*/
/*****************************************************************************************************************************/

export default function Section01() {
  const { currentUser } = useSelector((state) => state.user);
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    // Show the red box after 3 seconds
    const timer = setTimeout(() => {
      setShowBox(true);
    }, 3000);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowBox(false);
  };

  return (
    <section className="relative">
      {/* Red Box (Under Construction) */}
      {showBox && (
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-center py-2 px-6 rounded-b-lg shadow-lg animate-fall"
          style={{ zIndex: 999 }}
        >
          <p className="text-lg">
            This page is under construction. Stay tuned, we will be up soon.
          </p>
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 text-white text-2xl font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* left */}
        <div className="flex flex-col justify-center items-center lg:items-start md:py-4 sm:py-4">
          <h2 className="text-5xl md:mb-8 lg:mb-8 font-Aclonica text-center lg:text-left">
            It’s a Big World Out There,{" "}
            <span className="text-[#F4AC20]">Go Explore </span>
          </h2>
          <p className="text-gray-700 text-lg text-center lg:text-left hidden sm:block px-2">
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

        {/* right */}
        <div className=" md:py-4">
          <div className="lg:h-full md:h-full rounded-md md:flex md:justify-center md:visible lg:visible h-1/5 m-6 md:m-0">
            <img
              src={homecover}
              alt="cover.img"
              className="lg:w-full md:w-1/2"
            />
          </div>
        </div>
      </div>
      {/* Row02 */}
      <div className="bg-white shadow-xl rounded-2xl flex flex-col items-center">
        <p className="text-gray-500 text-lg text-center md:pt-4 lg:pt-4 px-2">
          Design your dream vacation with complete flexibility! We give you the
          freedom to customize every detail of your journey, from your arrival
          to departure. Tailor your trip to fit your preferences by choosing:
        </p>
        {/* Bullet points */}
        <div className="text-gray-500 text-lg flex flex-col sm:flex-row sm:space-x-8 pt-1">
          <div className="flex items-center space-x-2">
            <span className="text-[#F4AC20]">•</span>
            <span>Destinations</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#F4AC20]">•</span>
            <span>Travel Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#F4AC20]">•</span>
            <span>Accommodation</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#F4AC20]">•</span>
            <span>Transportation</span>
          </div>
        </div>
        <div className="py-4 lg:py-6">
          <a href="/customize">
            <button className="bg-[#F4AC20] text-white py-4 px-6 rounded-lg hover:bg-[#f49120]">
              <b className="text-xl">Customize Your Own Plan</b>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
