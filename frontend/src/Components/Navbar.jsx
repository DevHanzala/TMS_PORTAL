import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/TMS-LOGO.webp"; // Ensure the logo exists in the assets folder
import { useAuthStore } from "../Store/authStore"; // Adjust the path to your authStore

const Navbar = () => {
  const { user, role } = useAuthStore();

  // Define navigation links based on role
  const getNavLinks = () => {
    if (role === "employee") {
      return [
        { path: "/", label: "Home" },
        { path: "/profile", label: "Profile" },
      ];
    } else if (role === "employer" || role === "HR") {
      return [
        { path: "/", label: "Home" },
        { path: "/uploadfile", label: "Upload" },
        { path: "/view", label: "Excel Data" },
        { path: "/register", label: "Registration" },
        { path: "/users", label: "Staff" },
        { path: "/registerusers", label: "Payrolls" },
      ];
    }
    return []; // Default case (shouldn't happen if user is logged in)
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-black text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <img src={logo} alt="Techmire Solution Logo" className="h-10 mr-3" />
          <h1 className="text-2xl font-bold">Techmire Solution</h1>
        </motion.div>

        {/* Navigation Links */}
        {user && (
          <div className="space-x-2">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-[oklch(0.67_0.19_42.13)]" : "bg-gray-500 hover:bg-gray-700"
                    } text-white`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;