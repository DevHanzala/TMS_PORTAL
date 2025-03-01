import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/TMS-LOGO.webp";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-6 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo & Company Info */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Techmire Solution Logo" className="h-12" />
          <div>
            <h2 className="text-xl font-bold">Techmire Solution</h2>
            <p className="text-sm text-gray-400">Innovating Your Digital Presence</p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="text-center md:text-left mt-4 md:mt-0">
          <p className="flex items-center space-x-2">
            <FaEnvelope className="text-gray-400" />
            <span>contact@techmire.com</span>
          </p>
          <p className="flex items-center space-x-2">
            <FaPhone className="text-gray-400" />
            <span>+1 (234) 567-890</span>
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-4 md:mt-0">
          <a href="#" className="block hover:text-gray-400 transition">Privacy Policy</a>
          <a href="#" className="block hover:text-gray-400 transition">Terms of Service</a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} Techmire Solution. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
