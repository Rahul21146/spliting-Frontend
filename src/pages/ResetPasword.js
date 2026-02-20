// import React, { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Shield, Key } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import Navbar from "../components/Navbar";

// function ResetPassword() {
//   const navigate = useNavigate();
//   const { email, token } = useParams();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [passwordsMatch, setPasswordsMatch] = useState(true);

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleBackToLogin = () => {
//     navigate("/login");
//   };

//   const updatePasswordStrength = (value) => {
//     let strength = 0;
//     if (value.length > 7) strength += 25;
//     if (value.match(/[A-Z]/)) strength += 25;
//     if (value.match(/[0-9]/)) strength += 25;
//     if (value.match(/[^A-Za-z0-9]/)) strength += 25;
//     setPasswordStrength(strength);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setPasswordsMatch(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           token,
//           newPassword: password,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert("Password reset successful!");
//         navigate("/login");
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       alert("Something went wrong");
//     }
//   };

//   const getStrengthColor = () => {
//     if (passwordStrength < 25) return "bg-red-500";
//     if (passwordStrength < 50) return "bg-orange-500";
//     if (passwordStrength < 75) return "bg-yellow-500";
//     return "bg-green-500";
//   };

//   const getStrengthText = () => {
//     if (passwordStrength < 25) return "Weak";
//     if (passwordStrength < 50) return "Fair";
//     if (passwordStrength < 75) return "Good";
//     return "Strong";
//   };

//   const getStrengthBgColor = () => {
//     if (passwordStrength < 25) return "bg-red-50 border-red-100";
//     if (passwordStrength < 50) return "bg-orange-50 border-orange-100";
//     if (passwordStrength < 75) return "bg-yellow-50 border-yellow-100";
//     return "bg-green-50 border-green-100";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md mx-auto">

//           <button 
//             onClick={handleBackToLogin}
//             className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors group"
//           >
//             <div className="bg-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all">
//               <ArrowLeft className="h-4 w-4" />
//             </div>
//             <span className="ml-3 font-medium">Back to Login</span>
//           </button>

//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

//             <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-6 text-center">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
//                 <span className="text-white font-bold text-2xl">SW</span>
//               </div>
//               <h1 className="text-2xl font-bold text-white">Reset Password</h1>
//               <p className="text-green-50 text-sm mt-1">
//                 Create a new password for your account
//               </p>
//             </div>

//             <div className="p-6">

//               <form className="space-y-5" onSubmit={handleSubmit}>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type="email"
//                       value={email}
//                       disabled
//                       className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
//                     />
//                     <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter new password"
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                         updatePasswordStrength(e.target.value);
//                       }}
//                       className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     >
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Re-enter new password"
//                       value={confirmPassword}
//                       onChange={(e) => {
//                         setConfirmPassword(e.target.value);
//                         setPasswordsMatch(e.target.value === password);
//                       }}
//                       className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     >
//                       {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg mt-6"
//                 >
//                   <Key className="h-5 w-5 inline mr-2" />
//                   Reset Password
//                 </button>

//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResetPassword;


import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Key } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";

function ResetPassword() {
  const navigate = useNavigate();
  const params = useParams();

  const email = decodeURIComponent(params.email || "");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const updatePasswordStrength = (value) => {
    let strength = 0;
    if (value.length > 7) strength += 25;
    if (value.match(/[A-Z]/)) strength += 25;
    if (value.match(/[0-9]/)) strength += 25;
    if (value.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!password || !confirmPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    setPasswordsMatch(false);
    toast.error("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(
        `${mainApi}/spliting/v1/reset-password`,
      {
        email: email,
        password: password,
        newPassword: confirmPassword,
      }
    );

    if (response.data.success) {
      toast.success("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } else {
      toast.error(response.data.message || "Reset failed");
    }

  } catch (error) {
    console.error(error);

    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Server error");
    }
  }
};


  const getStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  // getStrengthBgColor removed (unused)

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">

          <button 
            onClick={handleBackToLogin}
            className="flex items-center text-gray-400 hover:text-red-400 mb-6 transition-colors group"
          >
            <div className="bg-gray-900 p-2 rounded-full shadow-md group-hover:shadow-lg transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="ml-3 font-medium">Back to Login</span>
          </button>

          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">

            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-6 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-3 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-2xl">SW</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Reset Password</h1>
              <p className="text-red-50 text-sm mt-1">
                Create a new password for your account
              </p>
            </div>

            <div className="p-6">

              <form className="space-y-5" onSubmit={handleSubmit}>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-10 pr-10 py-3 border border-gray-800 rounded-xl bg-gray-900 text-gray-400 cursor-not-allowed"
                    />
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        updatePasswordStrength(value);
                        setPasswordsMatch(value === confirmPassword || confirmPassword === "");
                      }}
                      className="w-full pl-10 pr-12 py-3 border border-gray-800 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-900 text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {passwordStrength > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex gap-1 flex-1">
                          <div className={`h-2 flex-1 rounded-full ${passwordStrength >= 25 ? getStrengthColor() : 'bg-gray-800'}`}></div>
                          <div className={`h-2 flex-1 rounded-full ${passwordStrength >= 50 ? getStrengthColor() : 'bg-gray-800'}`}></div>
                          <div className={`h-2 flex-1 rounded-full ${passwordStrength >= 75 ? getStrengthColor() : 'bg-gray-800'}`}></div>
                          <div className={`h-2 flex-1 rounded-full ${passwordStrength >= 100 ? getStrengthColor() : 'bg-gray-800'}`}></div>
                        </div>
                        <span className={`text-xs font-medium ml-2 ${getStrengthColor().replace('bg-', 'text-')}`}>
                          {getStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        const value = e.target.value;
                        setConfirmPassword(value);
                        setPasswordsMatch(password === value);
                      }}
                      className="w-full pl-10 pr-12 py-3 border border-gray-800 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent bg-gray-900 text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {passwordsMatch ? (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Passwords match
                    </p>
                  ) : (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6"
                >
                  <Key className="h-5 w-5" />
                  Reset Password
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Remember your password? 
                  <button 
                    onClick={handleBackToLogin}
                    className="text-red-500 font-semibold hover:text-red-400 transition ml-1 hover:underline"
                  >
                    Sign in
                  </button>
                </p>

              </form>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Need help? Contact us at support@splitwie.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

