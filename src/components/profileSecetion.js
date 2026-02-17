import React, { useEffect, useState } from "react";
import { Pencil, Mail, User, ArrowLeft, MapPin, Calendar } from "lucide-react";
import axios from "axios";

export default function ProfileSection({ onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";

  const token = localStorage.getItem("userToken"); // your JWT token

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${mainApi}/spliting/v1/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mainApi, token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-red-500 text-lg">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="bg-white shadow-lg rounded-2xl p-8 border">

        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img
            src={profile.image}
            className="w-28 h-28 rounded-full border-4 border-green-500 shadow-md object-cover"
            alt="profile"
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {profile.name}
            </h2>
            <p className="text-gray-500">{profile.role.toUpperCase()}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gray-50 rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-800">Email</p>
            </div>
            <p className="text-gray-600">{profile.email}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-800">Location</p>
            </div>
            <p className="text-gray-600">{profile.location || "Not added"}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-800">Gender</p>
            </div>
            <p className="text-gray-600">{profile.gender}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-800">Date of Birth</p>
            </div>
            <p className="text-gray-600">
              {profile.date_of_birth
                ? new Date(profile.date_of_birth).toDateString()
                : "Not added"}
            </p>
          </div>

        </div>

        {/* About */}
        <div className="mt-8 bg-gray-50 rounded-xl p-5 border">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-gray-800">About</p>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Hi, I'm {profile.name}. I am using Spliting to manage shared expenses easily.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 flex items-center gap-2">
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>

          <button className="px-5 py-2 border border-gray-300 rounded-lg shadow hover:bg-gray-100">
            Change Password
          </button>
        </div>

      </div>
    </div>
  );
}
