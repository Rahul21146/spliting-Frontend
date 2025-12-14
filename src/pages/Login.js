import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // On input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "https://spliting-backend.onrender.com/spliting/v1/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token = response.data?.token;

      if (!token) {
        toast.error("Token missing from server!");
        return;
      }

      // Save token with correct name
      localStorage.setItem("userToken", token);

      toast.success("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="h-screen w-full bg-gray-100 flex flex-col font-sans mt-12">
      <div className="w-full bg-white overflow-hidden flex-1 flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 h-full p-4 sm:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-extrabold mb-1 text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mb-8 text-base">Sign in to continue your seamless journey.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              <div className="text-right text-sm">
                <a href="#" className="text-green-600 font-medium hover:text-green-700 transition">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-xl mt-4 text-base tracking-wide transition-all disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login to Account"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?
                <a href="/signup" className="text-green-600 font-bold hover:text-green-700 transition"> Sign up now</a>
              </p>

            </form>

          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:block w-1/2 relative bg-gray-900 h-full">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-800/90 via-green-800/60 to-transparent"></div>

          <div className="absolute bottom-0 left-0 p-10 lg:p-16 text-white z-10">
            <h3 className="text-4xl font-extrabold mb-3 leading-tight">
              Access Your <br /> Dashboard.
            </h3>
            <p className="text-lg text-green-100 leading-relaxed max-w-md">
              Securely sign in to manage your projects, data, and collaborations.
            </p>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}

export default Login;
