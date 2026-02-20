import React, { useState } from "react";
import axios from "axios";
import { Camera, MapPin, Calendar, Mail, User, Lock, Heart, Hash } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    gender: "",
    date_of_birth: "",
    location: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";
  const navigate = useNavigate();

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- HANDLE IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ---------------- SUBMIT FORM ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Prepare form data
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // API Request
      const res = await axios.post(
        `${mainApi}/spliting/v1/register`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", res.data);
  toast.success("Account created successfully!");
  navigate("/login");

    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <span className="px-4 py-2 text-sm font-semibold bg-red-600/20 text-red-500 rounded-full border border-red-500/30">
                Join Spliting — Create Account
              </span>

              <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">
                Create your account.
                <br />
                <span className="text-red-600">Share expenses. Settle faster.</span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 max-w-2xl">
                Sign up to start tracking shared expenses and managing group ledgers.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
                <p className="text-gray-400 mb-6">Start your seamless journey today.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Profile Image */}
                <div className="md:col-span-2 flex flex-col items-center justify-center mb-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-full border-4 border-red-600 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-100/5 rounded-full border-4 border-dashed border-red-600/30 flex items-center justify-center text-red-500">
                      <Camera className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="text-center mt-2">
                  <span className="font-bold text-lg text-white">Your Photo</span>
                  <span className="text-sm text-gray-400 block">Upload a profile picture</span>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Username</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="username"
                    placeholder="user_handle"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Gender</label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1 block">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-400 mb-1 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="location"
                    placeholder="New York, USA"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                  />
                </div>
              </div>

              {/* Submit */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-xl disabled:opacity-50"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-10 right-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}

export default Signup;
