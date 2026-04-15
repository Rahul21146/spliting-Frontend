

import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { GoogleLogin } from "@react-oauth/google";
import { login, loginWithGoogle } from "../servises/operations";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const [loading, setLoading] = useState(false);

   

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
      await dispatch(login(formData.email, formData.password, navigate));
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {

    try {
      setLoading(true);
      await dispatch(loginWithGoogle(response.credential, navigate));

    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error(err.response?.data?.message || "Google sign-in failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was not successful. Try again.");
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
                Welcome Back to Spliting
              </span>

              <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">
                Sign in to your account.
                <br />
                <span className="text-red-600">Fast. Secure. Clear.</span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 max-w-2xl">
                Manage your ledgers and track group expenses effortlessly.
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-400 mb-6">Sign in to continue your seamless journey.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* EMAIL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full p-2 pl-9 border border-gray-700 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                      />
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <button
                      type="button"
                      className="text-red-500 font-medium hover:text-red-400 cursor-pointer transition"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-xl mt-4 text-base tracking-wide transition-all disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Login to Account"}
                  </button>

                </form>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-0.5 bg-gray-800"></div>
                  <p className="px-2 text-sm text-gray-400">OR</p>
                  <div className="flex-1 h-0.5 bg-gray-800"></div>
                </div>

                {googleClientId && (
                  <div className="mt-4">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                  </div>
                )}

                <p className="text-center text-sm text-gray-400 mt-4">
                  Don't have an account?
                  <a 
                  onClick={() => navigate("/register")}
                  href="/register" className="text-red-500 font-bold hover:text-red-400 transition"> Sign up now</a>
                </p>
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

export default Login;

