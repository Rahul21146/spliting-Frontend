import React from "react";
import { Facebook, Twitter, Instagram, Github, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand / About Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-4">Spliting</h2>
          <p className="text-gray-400">
            Simplifying shared expenses for friends, families, and teams. 
            Manage ledgers, split bills, and settle payments effortlessly.
          </p>
          <div className="flex gap-4 mt-4">
            <Facebook className="w-6 h-6 hover:text-red-500 cursor-pointer" />
            <Twitter className="w-6 h-6 hover:text-red-500 cursor-pointer" />
            <Instagram className="w-6 h-6 hover:text-red-500 cursor-pointer" />
            <Github className="w-6 h-6 hover:text-red-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li
              onClick={() => navigate("/")}
              className="hover:text-red-500 cursor-pointer"
            >
              Home
            </li>
            <li className="hover:text-red-500 cursor-pointer">About</li>
            <li className="hover:text-red-500 cursor-pointer">Features</li>
            <li className="hover:text-red-500 cursor-pointer">Pricing</li>
            <li className="hover:text-red-500 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <p className="flex items-center gap-3 text-gray-400 hover:text-red-500 cursor-pointer">
            <Mail className="w-5 h-5" />
            support@spliting.com
          </p>
          <p className="flex items-center gap-3 mt-2 text-gray-400 hover:text-red-500 cursor-pointer">
            <Phone className="w-5 h-5" />
            +91 98765 43210
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-500 text-sm mt-12 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Spliting App. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
