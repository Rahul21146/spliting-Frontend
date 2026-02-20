import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  Wallet,
  ListChecks,
  Banknote
} from 'lucide-react';

import Navbar from '../components/Navbar';

// -- Feature Data --
const features = [
  { icon: ShieldCheck, title: "Secure Splitting", description: "Your transaction and ledger data are fully encrypted and protected with enterprise-grade security." },
  { icon: Zap, title: "Instant Expense Sync", description: "Split expenses in real time with your friends, team, or roommates instantly." },
  { icon: TrendingUp, title: "Smart Insights", description: "Know who owes whom, how much, and settle faster using intelligent AI-driven breakdowns." },
  { icon: Globe, title: "Accessible Anywhere", description: "Your ledgers work on any device—web or mobile—making collaboration seamless." },
];

// -- Reviews --
const reviews = [
  { name: "Amit Verma", role: "Software Engineer", review: "Spliting completely changed how our friend group handles expenses. No more confusion—everything is crystal clear!", rating: 5, avatar: "https://i.pravatar.cc/150?img=56" },
  { name: "Priya Sharma", role: "Marketing Head", review: "Love the interface! Adding expenses has never been easier. The QR payment feature is a killer addition.", rating: 4, avatar: "https://i.pravatar.cc/150?img=47" },
  { name: "Rohit Singh", role: "Business Owner", review: "Amazing and fast! Perfect for trips, events, and office expenses. No arguments, no delays—just clarity.", rating: 5, avatar: "https://i.pravatar.cc/150?img=33" },
];

function Home() {
  const [current, setCurrent] = useState(0);
  const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";

  const [stats, setStats] = useState({
    total_users: 0,
    total_ledgers: 0,
    total_active_ledgers: 0,
    total_transactions: 0,
    total_transaction_amount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
  const res = await fetch(`${mainApi}/spliting/v1/dashboard/stats`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      }
    };
    fetchStats();
  }, [mainApi]);

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

return (
  <div className="bg-black text-white min-h-screen">
    <Navbar />

    {/* HERO SECTION */}
    <section className="relative pt-20 pb-32 md:pt-32 md:pb-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <span className="inline-block px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold bg-red-600/20 text-red-500 rounded-full border border-red-500/30">
          Welcome to Spliting – Smart Expense Sharing
        </span>

        <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Split Expenses in Seconds.
          <br />
          <span className="text-red-600">Settle Smarter. Stress Less.</span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
          Track group expenses, automate balances, and settle instantly using built-in QR payments — all in one powerful platform.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-2">
          <button className="px-6 sm:px-10 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-lg hover:scale-105 transition text-sm sm:text-base">
            Get Started <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 inline" />
          </button>

          <button className="px-6 sm:px-10 py-2.5 sm:py-3 border border-gray-600 hover:border-white text-white font-semibold rounded-md transition text-sm sm:text-base">
            Watch Demo
          </button>
        </div>
      </div>

      {/* Cinematic Glow */}
      <div className="absolute -top-20 -right-20 sm:top-20 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-red-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 sm:bottom-10 sm:left-20 w-48 sm:w-64 h-48 sm:h-64 bg-red-500/10 rounded-full blur-3xl"></div>
    </section>

    {/* STATS SECTION */}
    <section className="py-16 sm:py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Platform Overview</h2>

        <p className="text-gray-400 max-w-3xl mx-auto mb-12 sm:mb-16 text-sm sm:text-base">
          Real-time platform activity across users, ledgers, and transactions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
          {[
            { value: stats.total_users, label: "Total Users", icon: Users },
            { value: stats.total_ledgers, label: "Total Ledgers", icon: ListChecks },
            { value: stats.total_active_ledgers, label: "Active Ledgers", icon: ShieldCheck },
            { value: stats.total_transactions, label: "Transactions", icon: Wallet },
            { value: `₹${stats.total_transaction_amount}`, label: "Total Amount", icon: Banknote },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-red-600/30 border border-gray-700"
            >
              <item.icon className="w-8 sm:w-10 h-8 sm:h-10 text-red-500 mx-auto mb-3 sm:mb-4" />
              <p className="text-2xl sm:text-3xl font-bold">{item.value}</p>
              <p className="text-gray-400 mt-2 text-xs sm:text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="py-16 sm:py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Why Choose Spliting?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Designed for modern groups and teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 hover:border-red-600 hover:scale-105 transition"
            >
              <feature.icon className="w-8 sm:w-10 h-8 sm:h-10 text-red-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* REVIEWS */}
    <section className="py-16 sm:py-28 bg-gradient-to-b from-gray-900 to-black text-center">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16">What Our Users Say</h2>

        <div className="relative max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 p-6 sm:p-10 rounded-2xl shadow-2xl">
            <img
              src={reviews[current].avatar}
              className="w-16 sm:w-24 h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-6 border-4 border-red-600"
              alt="user"
            />

            <p className="text-base sm:text-xl text-gray-300 italic mb-4 sm:mb-6">
              "{reviews[current].review}"
            </p>

            <div className="flex justify-center mb-3 sm:mb-4">
              {[...Array(reviews[current].rating)].map((_, i) => (
                <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 fill-red-500" />
              ))}
            </div>

            <p className="font-bold text-sm sm:text-base">{reviews[current].name}</p>
            <p className="text-gray-500 text-xs sm:text-sm">{reviews[current].role}</p>
          </div>

          <button
            onClick={prevReview}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-red-600 p-2 sm:p-3 rounded-full transition"
          >
            <ChevronLeft className="w-4 sm:w-6 h-4 sm:h-6" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-red-600 p-2 sm:p-3 rounded-full transition"
          >
            <ChevronRight className="w-4 sm:w-6 h-4 sm:h-6" />
          </button>
        </div>
      </div>
    </section>

    {/* FOUNDER SECTION */}
    <section className="py-16 sm:py-28 bg-black text-center">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16">Meet the Founder</h2>

        <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 p-8 sm:p-12 rounded-2xl hover:border-red-600 transition">
          <img
            src="https://res.cloudinary.com/dh2go77wo/image/upload/v1754741460/BlogApp/kvwmzo7m5cb6bsosjpph.jpg"
            className="w-32 sm:w-44 h-32 sm:h-44 rounded-full mx-auto mb-4 sm:mb-6 border-4 border-red-600"
            alt="Founder"
          />

          <h3 className="text-2xl sm:text-3xl font-bold">Rahul Singh</h3>
          <p className="text-red-500 font-semibold mt-1 sm:mt-2 text-sm sm:text-base">
            Founder & Lead Developer
          </p>

          <p className="mt-4 sm:mt-6 text-gray-400 leading-relaxed text-sm sm:text-lg">
            Created Spliting to eliminate confusion in shared expenses.
            What started small is now helping teams and friends across the country.
          </p>
        </div>
      </div>
    </section>
  </div>
);
}

export default Home;
