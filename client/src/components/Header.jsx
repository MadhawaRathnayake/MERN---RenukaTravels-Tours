/* eslint-disable no-unused-vars */
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {

  const dispatch = useDispatch();
  
  const handleSignout = async () => {
    try {
        const res = await fetch('/api/user/signout', {
            method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
        } else {
            dispatch(signoutSuccess());
        }
    } catch (error) {
        console.log(error.message);
    }
}

  const {currentUser} = useSelector((state) => state.user);
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
            <a className="hover:text-[#F4AC20]" href="/destinations/sri-lanka">
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
          {!currentUser && (
    <li>
      <a className="hover:text-[#F4AC20]" href="/signin">
        LOG IN
      </a>
    </li>
  )}
        </ul>
      </div>

     
      <div className="flex items-center gap-6 " >
      {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="user"
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                @{currentUser.username}
                            </span>
                            <span className="block text-sm font-medium truncate">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=dash'}>
                            <Dropdown.Item>Dashboard</Dropdown.Item>
                        </Link>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                  <Link to="/register">
                  <button className="bg-[#F4AC20] text-white font-bold px-8 py-2 rounded-lg hover:bg-[#f49120]">
                    Register
                  </button>
                </Link>
                )}
     
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
