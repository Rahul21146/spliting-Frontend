import React, { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  Home, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus 
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  };

  // Check on page load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Listen for token changes (logout/login from other tabs)
  useEffect(() => {
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="w-full bg-gray-900 text-white shadow-lg fixed top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <h1 className="text-2xl font-bold tracking-wider hover:text-green-400 transition-colors">
              MyProject
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">

            {/* Home */}
            <NavLink to="/" className="flex items-center gap-2 hover:text-green-400 transition-colors font-medium">
              <Home className="w-5 h-5" /> Home
            </NavLink>

            {isLoggedIn ? (
              <>
                {/* Dashboard */}
                <NavLink 
                  to="/dashboard"
                  className="flex items-center gap-2 hover:text-green-400 transition-colors font-medium"
                >
                  <User className="w-5 h-5" /> Dashboard
                </NavLink>

                {/* Profile */}
                <NavLink 
                  to="/profile"
                  className="flex items-center gap-2 hover:text-green-400 transition-colors font-medium"
                >
                  <User className="w-5 h-5" /> Profile
                </NavLink>

                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <NavLink to="/login">
                  <button className="flex items-center gap-2 hover:text-green-400 transition-colors font-medium">
                    <LogIn className="w-5 h-5" /> Login
                  </button>
                </NavLink>

                {/* Register */}
                <NavLink to="/register">
                  <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors text-sm font-bold">
                    <UserPlus className="w-5 h-5" /> Register
                  </button>
                </NavLink>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-2 pb-4 space-y-3 flex flex-col">

            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Home size={20} /> Home
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <User size={20} /> Dashboard
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <User size={20} /> Profile
                </NavLink>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
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
