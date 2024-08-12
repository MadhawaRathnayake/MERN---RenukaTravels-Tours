/* eslint-disable no-unused-vars */
import { Navbar } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuImage, setMenuImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/renuka-travels-and-tours.appspot.com/o/menu.png?alt=media&token=0a69998f-9053-4d38-8da9-17078f45b263"
  );
  const [navLinksClass, setNavLinksClass] = useState("top-[-100%]");

  const toggleMenuImage = () => {
    setMenuImage((prevImage) =>
      prevImage ===
      "https://firebasestorage.googleapis.com/v0/b/renuka-travels-and-tours.appspot.com/o/menu.png?alt=media&token=0a69998f-9053-4d38-8da9-17078f45b263"
        ? "https://firebasestorage.googleapis.com/v0/b/renuka-travels-and-tours.appspot.com/o/close.png?alt=media&token=e9c9b00f-591b-4cb4-b81c-43e6b2deccac"
        : "https://firebasestorage.googleapis.com/v0/b/renuka-travels-and-tours.appspot.com/o/menu.png?alt=media&token=0a69998f-9053-4d38-8da9-17078f45b263"
    );

    setNavLinksClass((prevClass) =>
      prevClass === "top-[-100%]"
        ? "top-[15%] justify-center text-center"
        : "top-[-100%]"
    );
  };

  return (
    <Navbar className="max-w-7xl mx-auto py-8 px-8 flex justify-between items-center">
      <div>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/renuka-travels-and-tours.appspot.com/o/logo.png?alt=media&token=a7e8b83d-3459-463c-8a41-5439ec0b3f27"
          alt="logo.img"
          className="w-24 lg:w-44"
        />
      </div>
      <div
        className={`lg:static absolute bg-white lg:min-h-fit min-h-[60vh] left-0 ${navLinksClass} lg:w-auto w-full flex items-center px-5`}
      >
        <ul className="flex lg:flex-row flex-col lg:items-center lg:gap-[4vw] gap-8">
          <li>
            <a className="hover:text-[#F4AC20]" href="/">
              HOME
            </a>
          </li>
          <li>
            <a className="hover:text-[#F4AC20]" href="/about">
              ABOUT US
            </a>
          </li>
          <li>
            <a className="hover:text-[#F4AC20]" href="#">
              DESTINATIONS
            </a>
          </li>
          <li>
            <a className="hover:text-[#F4AC20]" href="#">
              FEATURED TOURS
            </a>
          </li>
          <li>
            <a className="hover:text-[#F4AC20]" href="#">
              GALLERY
            </a>
          </li>
          <li>
            <a className="hover:text-[#F4AC20]" href="#">
              LOG IN
            </a>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-6">
        <button className="bg-[#F4AC20] text-white font-bold px-8 py-2 rounded-lg hover:bg-[#f49120]">
          Register
        </button>
        <img
          src={menuImage}
          alt="menu.img"
          className=" w-6 lg:w-0 xl:w-0 cursor-pointer lg:hidden"
          onClick={toggleMenuImage}
        />
      </div>
    </Navbar>
  );
}
