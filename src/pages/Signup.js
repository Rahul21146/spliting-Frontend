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
    <div>
      <Navbar />
      <div className="min-h-screen w-full bg-gray-100 flex flex-col font-sans mt-16">
      <div className="w-full bg-white overflow-hidden flex-1 flex flex-col md:flex-row">

        {/* LEFT SECTION */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-extrabold mb-1 text-gray-900">Create an Account</h2>
            <p className="text-gray-500 mb-6">Start your seamless journey today.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Profile Image */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="relative 
                                w-20 h-20 
                                sm:w-24 sm:h-24 
                                md:w-28 md:h-28 
                                lg:w-32 lg:h-32">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-full border-4 border-green-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 rounded-full border-4 border-dashed border-green-300 flex items-center justify-center text-green-600">
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
                  <span className="font-bold text-lg text-gray-800">Your Photo</span>
                  <span className="text-sm text-gray-500 block">Upload a profile picture</span>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Username</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="username"
                    placeholder="user_handle"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Gender</label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
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
                <label className="text-xs font-medium text-gray-700 mb-1 block">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="location"
                    placeholder="New York, USA"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-xl disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:block w-1/2 relative bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Team collaboration"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        </div>

      </div>
    </div>
    </div>
  );
}

export default Signup;
