import React from "react";
import { Link } from "react-router-dom";

const quick_links = [
  { path: "/home", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/tours", display: "Tours" },
];

const quick_links2 = [
  { path: "/gallery", display: "Gallery" },
  { path: "/login", display: "Login" },
  { path: "/register", display: "Register" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#fefcfb] py-12 px-8 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4 text-center lg:text-left">
          {/* Logo and Description */}
          <div className="w-full lg:w-1/5 px-4 mb-8 lg:mb-0">
            <div className="mb-4">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/renuka-travels-and-tours.appspot.com/o/logo.png?alt=media&token=a7e8b83d-3459-463c-8a41-5439ec0b3f27"
                alt="logo.img"
                className="w-24 lg:w-44"
              />
              <p className="text-gray-600">
                We believe brand interaction is key in communication. Real
                innovations and a positive...
              </p>
              <div className="flex justify-center lg:justify-start gap-4 mt-4 text-gray-700">
                <Link to="#" className="text-2xl">
                  <i className="ri-twitter-line"></i>
                </Link>
                <Link to="#" className="text-2xl">
                  <i className="ri-instagram-line"></i>
                </Link>
                <Link to="#" className="text-2xl">
                  <i className="ri-youtube-line"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Discover Section */}
          <div className="w-full lg:w-1/5 px-4 mb-8 lg:mb-0">
            <h5 className="text-lg font-bold text-gray-800 mb-4">Discover</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-600">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600">
                  FAQ's
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-600">
                  News
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="w-full lg:w-1/5 px-4 mb-8 lg:mb-0">
            <h5 className="text-lg font-bold text-gray-800 mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/core-values" className="text-gray-600">
                  Core Values
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-gray-600">
                  Partner w/ Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="w-full lg:w-1/5 px-4 mb-8 lg:mb-0">
            <h5 className="text-lg font-bold text-gray-800 mb-4">Contact</h5>
            <ul className="space-y-2 text-gray-600">
              <li>Address: Sri Lanka</li>
              <li>Email: </li>
              <li>Phone: </li>
            </ul>
          </div>

          {/* Get in Touch Section */}
          <div className="w-full lg:w-1/5 px-4 mb-8 lg:mb-0">
            <h5 className="text-lg font-bold text-gray-800 mb-4">
              Get in touch
            </h5>
            <input
              type="email"
              placeholder="Your email here..."
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
            />
            <button className="w-full bg-[#F4AC20] text-white px-4 py-2 rounded-md">
              Get Access
            </button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center py-6">
          <p className="text-gray-600">
            &copy; {year}, designed and developed by #. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/terms" className="text-gray-600">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
