import React from "react";
import { Routes, Route } from "react-router-dom";

// Navbar and Footer are not used in this app entry
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/forgetpassword";
import ResetPassword from "./pages/ResetPasword";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col item-center mx-auto">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:email/:token" element={<ResetPassword />} />

          
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
