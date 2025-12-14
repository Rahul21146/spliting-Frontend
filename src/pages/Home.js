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
        const res = await fetch("http://localhost:5000/spliting/v1/dashboard/stats");
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      }
    };
    fetchStats();
  }, []);

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-28 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 opacity-60"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <span className="px-5 py-2 text-sm font-semibold bg-green-100 text-green-700 rounded-full shadow-sm">
              Welcome to Spliting – Smart Expense Sharing
            </span>

            <h1 className="mt-6 text-6xl md:text-7xl font-extrabold leading-tight text-gray-900">
              Split Expenses in Seconds.
              <br />
              <span className="text-green-600">Settle Smarter. Stress Less.</span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Track group expenses, automate balances, and settle instantly using built-in QR payments — all in one beautiful platform.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-lg hover:scale-[1.05] transition">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5 inline" />
              </button>

              <button className="px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="absolute top-10 right-10 w-56 h-56 bg-green-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-6 w-40 h-40 bg-green-300/40 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 ">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
  Platform Overview
</h2>

<p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 text-center">
  A quick snapshot of Spliting’s activity — showing how many users are on the platform,
  how many ledgers are active, and the total transactions recorded across all groups.
  These real-time stats highlight how Spliting simplifies shared expenses for friends,
  roommates, teams, and families every day.
</p>


          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

            <div className="p-6 bg-white border rounded-xl shadow text-center">
              <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.total_users}</p>
              <p className="text-gray-600">Total Users</p>
            </div>

            <div className="p-6 bg-white border rounded-xl shadow text-center">
              <ListChecks className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.total_ledgers}</p>
              <p className="text-gray-600">Total Ledgers</p>
            </div>

            <div className="p-6 bg-white border rounded-xl shadow text-center">
              <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.total_active_ledgers}</p>
              <p className="text-gray-600">Active Ledgers</p>
            </div>

            <div className="p-6 bg-white border rounded-xl shadow text-center">
              <Wallet className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold">{stats.total_transactions}</p>
              <p className="text-gray-600">Total Transactions</p>
            </div>

            <div className="p-6 bg-white border rounded-xl shadow text-center">
              <Banknote className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold">₹{stats.total_transaction_amount}</p>
              <p className="text-gray-600">Total Amount</p>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Spliting?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed for groups, events, teams, and friends — Spliting handles all the messy calculations for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition hover:-translate-y-1">
                <feature.icon className="w-9 h-9 text-green-600 mb-4 bg-green-100 p-2 rounded-md" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">What Our Users Say</h2>

          <div className="relative max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-xl border">
              <img src={reviews[current].avatar} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-md" alt="user" />

              <p className="text-xl italic text-gray-700 mb-4">{reviews[current].review}</p>

              <div className="flex justify-center mb-2">
                {[...Array(reviews[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="font-bold text-gray-900">{reviews[current].name}</p>
              <p className="text-sm text-gray-500">{reviews[current].role}</p>
            </div>

            <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* ⭐⭐ FOUNDER SECTION ⭐⭐ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Meet the Founder</h2>

          <div className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <img
              src="https://res.cloudinary.com/dh2go77wo/image/upload/v1764072480/BlogApp/irn8w43nl1f8rcmzghy5.jpg"
              className="w-40 h-40 rounded-full mx-auto mb-6 shadow-lg"
              alt="Founder"
            />

            <h3 className="text-3xl font-bold text-gray-900">Priyank Dwivedi</h3>
            <p className="text-green-700 font-semibold mt-1">Founder & Lead Developer</p>

            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              Priyank Dwivedi created Spliting with a simple mission — to eliminate confusion in shared expenses.
              What started as a solution for roommates has grown into a powerful platform loved by groups,
              teams, and friends across the country.
            </p>

            <p className="mt-4 text-gray-600">
              Passionate about clean UI, real-time syncing, and financial clarity.
            </p>
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default Home;
