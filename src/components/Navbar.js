import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  User,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-gray-900 text-white shadow-xl fixed top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer select-none"
          >
            <span className="text-3xl font-extrabold text-green-500 tracking-wider">
              Spliting
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 transition font-medium ${
                  isActive ? "text-green-400" : "hover:text-green-400"
                }`
              }
            >
              <Home className="w-5 h-5" /> Home
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 transition font-medium ${
                      isActive ? "text-green-400" : "hover:text-green-400"
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </NavLink>

                {/* <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 transition font-medium ${
                      isActive ? "text-green-400" : "hover:text-green-400"
                    }`
                  }
                >
                  <User className="w-5 h-5" /> Profile
                </NavLink> */}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex items-center gap-2 hover:text-green-400 transition font-medium"
                >
                  <LogIn className="w-5 h-5" /> Login
                </NavLink>

                <NavLink to="/register">
                  <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                    <UserPlus className="w-5 h-5" /> Register
                  </button>
                </NavLink>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-3 pb-5 space-y-3 flex flex-col">

            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
            >
              <Home size={20} /> Home
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </NavLink>

                {/* <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  <User size={20} /> Profile
                </NavLink> */}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-gray-700 transition"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  <LogIn size={20} /> Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-3 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold"
                >
                  <UserPlus size={20} /> Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
