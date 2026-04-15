// import React from "react";
// import { Mail, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { toast } from "react-toastify";

// function ForgotPassword() {
//   const navigate = useNavigate();

//   const handleBackToLogin =  () => {
//     navigate("/login");
//   };
//   const handleSendRestlink=async ()=>{
//     try{

//     }
//     catch(error){
//         toast.error("Reset Link not send");
//     }
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="h-screen w-full bg-gray-100 flex flex-col font-sans mt-12">
//         <div className="w-full bg-white overflow-hidden flex-1 flex flex-col md:flex-row">

//           {/* LEFT SIDE - Full width since no image */}
//           <div className="w-full md:w-full h-full p-4 sm:p-8 lg:p-12 flex items-center justify-center">
//             <div className="w-full max-w-lg">
              
//               {/* Back button */}
//               <button 
//                 onClick={handleBackToLogin}
//                 className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Login
//               </button>

//               <h2 className="text-3xl font-extrabold mb-1 text-gray-900">Forgot Password?</h2>
//               <p className="text-gray-500 mb-8 text-base">
//                 No worries! Enter your email address and we'll send you a link to reset your password.
//               </p>

//               <form className="flex flex-col gap-5">

//                 {/* EMAIL */}
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="name@example.com"
//                       className="w-full p-2 pl-9 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-green-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-xl mt-4 text-base tracking-wide transition-all"
//                   onClick={handleSendRestlink}
//                 >
//                   Send Reset Link
//                 </button>

//                 <p className="text-center text-sm text-gray-500 mt-4">
//                   Remember your password? 
//                   <button 
//                     onClick={handleBackToLogin}
//                     className="text-green-600 font-bold hover:text-green-700 transition ml-1"
//                   >
//                     Sign in
//                   </button>
//                 </p>

//               </form>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { forgotPasswordLink } from "../servises/operations";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleSendRestlink = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);
      await dispatch(forgotPasswordLink(email, setEmail));
    } catch (error) {
      toast.error(error?.message || "Reset Link not sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">

            <button 
              onClick={handleBackToLogin}
              className="flex items-center text-gray-400 hover:text-red-400 mb-6 transition-colors"
            >
              <div className="bg-gray-900 p-2 rounded-full mr-3">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Back to Login</span>
            </button>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl">
              <h2 className="text-3xl font-extrabold mb-2">Forgot Password?</h2>
              <p className="text-gray-400 mb-6 text-base">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              <form className="flex flex-col gap-4" onSubmit={handleSendRestlink}>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full p-2 pl-9 border border-gray-800 rounded bg-gray-900 focus:ring-2 focus:ring-red-600 text-sm text-gray-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-xl text-base tracking-wide transition-all"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                  Remember your password? 
                  <button 
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-red-500 font-bold hover:text-red-400 transition ml-1"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
