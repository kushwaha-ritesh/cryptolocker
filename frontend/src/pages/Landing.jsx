// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold">RupeeLocker</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/login')} className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="bg-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto mt-12 px-6 md:px-0">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Your Crypto, Your Control</h2>
          <p className="text-lg md:text-xl">
            Manage all your wallets securely, connect multiple apps, and track your crypto assets with ease. 
            RupeeLocker makes it simple and safe.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <button onClick={() => navigate('/signup')} aria-label="Get started - Sign up" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>
            <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
              Learn More
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
            alt="Crypto Wallet"
            className="w-80 h-80 object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-indigo-800 mt-20 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          <div className="text-center p-6 shadow-lg rounded-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Multi-Wallet Support</h3>
            <p>Easily connect all your wallets and manage them from a single dashboard.</p>
          </div>
          <div className="text-center p-6 shadow-lg rounded-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p>We prioritize your security using end-to-end encryption and safe authentication.</p>
          </div>
          <div className="text-center p-6 shadow-lg rounded-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Fast Transactions</h3>
            <p>Send and receive crypto quickly with real-time transaction tracking.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-300">
        &copy; {new Date().getFullYear()} RupeeLocker. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
