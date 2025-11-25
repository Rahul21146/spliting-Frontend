import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Globe,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import Navbar from '../components/Navbar';

// -- Feature Data --
const features = [
  {
    icon: ShieldCheck,
    title: "Secure Splitting",
    description: "Your transaction and ledger data are fully encrypted and protected with enterprise-grade security."
  },
  {
    icon: Zap,
    title: "Instant Expense Sync",
    description: "Split expenses in real time with your friends, team, or roommates instantly."
  },
  {
    icon: TrendingUp,
    title: "Smart Insights",
    description: "Know who owes whom, how much, and settle faster using intelligent AI-driven breakdowns."
  },
  {
    icon: Globe,
    title: "Accessible Anywhere",
    description: "Your ledgers work on any device—web or mobile—making collaboration seamless."
  },
];

// --- Review/Testimonial Data ---
const reviews = [
  {
    name: "Amit Verma",
    role: "Software Engineer",
    review: "Spliting completely changed how our friend group handles expenses. No more confusion—everything is crystal clear!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=56"
  },
  {
    name: "Priya Sharma",
    role: "Marketing Head",
    review: "Love the interface! Adding expenses has never been easier. The QR payment feature is a killer addition.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "Rohit Singh",
    role: "Business Owner",
    review: "Amazing and fast! Perfect for trips, events, and office expenses. No arguments, no delays—just clarity.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=33"
  },
];

function Home() {
  const [current, setCurrent] = useState(0);

  const nextReview = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ⭐ NEW HERO SECTION */}
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

          {/* Floating Shapes */}
          <div className="absolute top-10 right-10 w-56 h-56 bg-green-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-6 w-40 h-40 bg-green-300/40 rounded-full blur-3xl"></div>
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
              <div
                key={index}
                className="p-6 bg-gray-50 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition hover:-translate-y-1"
              >
                <feature.icon className="w-9 h-9 text-green-600 mb-4 bg-green-100 p-2 rounded-md" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ REVIEW SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">What Our Users Say</h2>

          <div className="relative max-w-3xl mx-auto">
            {/* Review Card */}
            <div className="bg-white p-8 rounded-xl shadow-xl border">
              <img
                src={reviews[current].avatar}
                className="w-20 h-20 rounded-full mx-auto mb-4 shadow-md"
                alt="user"
              />

              <p className="text-xl italic text-gray-700 mb-4">{reviews[current].review}</p>

              <div className="flex justify-center mb-2">
                {[...Array(reviews[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="font-bold text-gray-900">{reviews[current].name}</p>
              <p className="text-sm text-gray-500">{reviews[current].role}</p>
            </div>

            {/* Controls */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Start Splitting Smarter</h3>
          <p className="text-gray-400 mb-6">Join thousands of users simplifying group expenses with Spliting.</p>

          <button className="bg-green-500 hover:bg-green-400 text-gray-900 font-extrabold py-3 px-10 rounded-lg shadow-xl transition hover:scale-105">
            Get Started Now
          </button>

          <p className="text-sm text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Spliting App. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Home;
