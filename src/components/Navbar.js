import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
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
  <header className="w-full fixed top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800">
    <nav className="max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex justify-between items-center h-16">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer select-none"
        >
          <span className="text-3xl font-extrabold text-red-600 tracking-wider hover:text-red-500 transition">
            Spliting
          </span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 transition duration-300 ${
                isActive
                  ? "text-white border-b-2 border-red-600 pb-1"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Home className="w-4 h-4" /> Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 transition duration-300 ${
                    isActive
                      ? "text-white border-b-2 border-red-600 pb-1"
                      : "text-gray-400 hover:text-white"
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md transition shadow-lg hover:shadow-red-600/40"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <LogIn className="w-4 h-4" /> Login
              </NavLink>

              <NavLink to="/register">
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md transition shadow-lg hover:shadow-red-600/40">
                  <UserPlus className="w-4 h-4" /> Register
                </button>
              </NavLink>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-400 hover:text-white transition"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>

    {/* MOBILE MENU */}
    {isMenuOpen && (
      <div className="md:hidden bg-black border-t border-gray-800">
        <div className="px-6 py-6 space-y-4 flex flex-col text-sm">

          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 text-gray-300 hover:text-white transition"
          >
            <Home size={18} /> Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition"
              >
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-500 hover:text-red-400 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition"
              >
                <LogIn size={18} /> Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold"
              >
                <UserPlus size={18} /> Register
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
