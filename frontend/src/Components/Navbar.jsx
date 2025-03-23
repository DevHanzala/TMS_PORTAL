import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/TMS-LOGO.webp"; // Ensure the logo exists in the assets folder
import { useAuthStore } from "../Store/authStore"; // Adjust the path to your authStore

const Navbar = () => {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  // Define navigation links based on role
  const getNavLinks = () => {
    const userRole = role?.toLowerCase();

    if (userRole === "employee") {
      return [
        { path: "/view", label: "Attendance" }, // Attendance button for employees
        { path: "/profile", label: "Profile" },  // Profile button for employees
      ];
    } else if (userRole === "employer" || userRole === "hr") {
      return [
        { path: "/uploadfile", label: "Upload" },
        { path: "/view", label: "Attendance" },
        { path: "/register", label: "Registration" },
        { path: "/users", label: "Staff" },
        { path: "/registerusers", label: "Payrolls" },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

        {/* Navigation Links and Logout */}
        {user ? (
          <div className="flex items-center space-x-2">
            {/* Navigation Links */}
            {navLinks.length > 0 &&
              navLinks.map((link, index) => (
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

            {/* Logout Button (shown for all roles) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <span>Please log in to see navigation options</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;