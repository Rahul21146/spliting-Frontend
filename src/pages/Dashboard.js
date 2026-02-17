// Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  Home as HomeIcon,
  Users,
  Folder,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  DollarSign,
  Target,
  LogOut,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";

import ActivityFeed from "../components/dashboards/ActivityFeed";
import LedgerForm from "../components/dashboards/LedgerForm";
import LedgerDetails from "../components/dashboards/LedgerDetails";
import ProfileSection from "../components/profileSecetion"; // ⭐ NEW IMPORT
import { useNavigate } from "react-router-dom";

const fallbackAvatar = "/mnt/data/3b3bb00d-cc95-4799-9b60-3db31cd94245.png";

// ⭐ UPDATED — Added Profile
const navBase = [
  { id: "dashboard", name: "Dashboard", icon: HomeIcon },
  { id: "ledgers", name: "Ledgers", icon: Folder },
  { id: "team", name: "Team", icon: Users },
  { id: "profile", name: "Profile", icon: Users }, // ⭐ NEW
  { id: "settings", name: "Settings", icon: Settings },
  { id: "activity", name: "Activity Feed", icon: Bell },
];

const metrics = [
  {
    title: "Total Revenue",
    value: "₹45,231",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "New Users",
    value: "2,400",
    change: "+3.1%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Ledgers",
    value: "7",
    change: "+8.0%",
    icon: Target,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
];

const MetricCard = ({ title, value, change, icon: Icon, color, bgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className={`p-2 rounded-full ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      <p
        className={`text-sm mt-1 font-semibold ${
          change && change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change} since last month
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState("dashboard"); // dashboard | activity | profile | ledgerDetails
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";

  const [ledgers, setLedgers] = useState([]);
  const [activities, setActivities] = useState([
    { actor: "You", action: 'created a ledger "Goa Trip Ledger".', time: "5 minutes ago" },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return alert("User not logged in");

        const decoded = jwtDecode(token);
        const user_id = decoded.id;

        const response = await axios.get(
          `${mainApi}/spliting/v1/userledgers/${user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const mappedLedgers = response.data.ledgers.map((l) => ({
            id: parseInt(l.ledger_id, 10), // convert ledger_id to numeric
            name: l.ledger_name,
            description: l.description,
            members: l.members.map((m) => ({
              id: m.id,
              username: m.username,
              email: m.email,
              amount: parseFloat(m.amount) || 0,
            })),
            transactions: [
              {
                title: "Dummy Transaction",
                from: "System",
                to: l.members.map((m) => m.username).join(", "),
                amount: parseFloat(l.net_balance) || 0,
                at: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            status: l.status,
          }));

          setLedgers(mappedLedgers);
          console.log("Fetched Ledgers:", mappedLedgers);
        }
      } catch (err) {
        console.error("Error fetching ledgers:", err);
      }
    };

    fetchLedgers();
  }, [mainApi]);

  // ⭐ Handle Create Ledger
  const handleCreateLedger = (ledger) => {
    setLedgers((s) => [ledger, ...s]);
    setActivities((a) => [
      { actor: "You", action: `created a ledger "${ledger.name}".`, time: "just now" },
      ...a,
    ]);
    setIsFormOpen(false);
    setSelectedLedger(ledger);
    setView("ledgerDetails");
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
    window.location.reload();
  };

  const openLedger = (ledger) => {
    setSelectedLedger(ledger);
    console.log("Selected Ledger:", ledger);
    setView("ledgerDetails");
  };

  // Sidebar
  const Sidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-30 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-gray-900 md:relative md:flex md:flex-col md:h-full`}
    >
      <div className="p-5 flex items-center justify-between md:justify-start bg-green-700/80">
        <h1 className="text-2xl font-extrabold text-white">Spliting</h1>
        <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navBase.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "activity") setView("activity");
              else if (item.id === "profile") setView("profile");
              else setView("dashboard");
              setIsSidebarOpen(false);
            }}
            className={`group w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
              view === item.id
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button type="button" onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded-lg">
          <LogOut className="mr-3 h-5 w-5" /> Sign Out
        </button>
      </div>
    </div>
  );

  // Header with Profile dropdown
  const Header = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (profileRef.current && !profileRef.current.contains(e.target)) {
          setIsProfileMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGoHome = () => {
      setIsProfileMenuOpen(false);
      navigate("/"); // go to home route
      setView("dashboard");
    };

    const handleGoProfile = () => {
      setIsProfileMenuOpen(false);
      setView("profile");
    };

    return (
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button className="md:hidden text-gray-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ledger or users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
              <Bell className="w-6 h-6" />
            </button>

            {/* Profile + dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              >
                <img
                  className="h-10 w-10 rounded-full border-2 border-green-500"
                  src={fallbackAvatar}
                  alt="user"
                />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Profile
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-30">
                  <button
                    onClick={handleGoHome}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Home
                  </button>
                  <button
                    onClick={handleGoProfile}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };

  const DashboardContent = () => (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-3 py-2 rounded-md bg-green-600 text-white"
        >
          Create Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Ledgers</h2>
          <div className="space-y-4">
            {ledgers.map((l) => (
              <div
                key={l.id}
                onClick={() => openLedger(l)}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100"
              >
                <div>
                  <p className="font-semibold text-gray-800">{l.name}</p>
                  <p className="text-sm text-gray-500">{l.members.length} members</p>
                  <p className="text-sm text-gray-500">{l.description}</p>
                </div>

                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    l.status === "Active"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {l.status}
                </span>

                <span className="font-bold text-gray-700">
                  ₹{l.members.reduce((s, m) => s + (m.amount || 0), 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

          {activities.slice(0, 5).map((a, i) => (
            <div key={i} className="text-sm text-gray-600 border-l-2 pl-3 mb-2">
              <strong>{a.actor}</strong> {a.action}
              <div className="text-xs text-gray-400">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {view === "profile" && (
            <div className="max-w-6xl mx-auto">
              <ProfileSection onBack={() => setView("dashboard")} />
            </div>
          )}

          {view === "activity" && (
            <div className="max-w-6xl mx-auto">
              <ActivityFeed activities={activities} onBack={() => setView("dashboard")} />
            </div>
          )}

          {view === "dashboard" && <DashboardContent />}

          {view === "ledgerDetails" && selectedLedger && (
            <div className="max-w-6xl mx-auto">
              <LedgerDetails
                ledgerId={selectedLedger.id}
                onBack={() => setView("dashboard")}
              />
            </div>
          )}
        </main>
      </div>

      {isFormOpen && (
        <LedgerForm onCreate={handleCreateLedger} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
