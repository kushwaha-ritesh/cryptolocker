// src/pages/Dashboard.jsx
import React, { useState } from "react";
import UserMenu from "../components/UserMenu";
import Sidebar from '../components/Sidebar';
// import ProtectedRoute from "../components/ProtectedRoute";

const walletsData = [
  { name: "Metamask", balance: "2.5 ETH" },
  { name: "Coinbase Wallet", balance: "1.2 BTC" },
  { name: "Trust Wallet", balance: "500 USDT" },
];

const Dashboard = () => {
  const [wallets, setWallets] = useState(walletsData);


  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar
      <aside className="w-64 bg-indigo-700 text-white flex flex-col p-6 justify-between">
        
        <nav className="flex flex-col space-y-4 justify-between">
          <h1 className="text-2xl font-bold mb-8">RupeeLocker</h1>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-600 transition">
            Dashboard
          </button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-600 transition">
            Transactions
          </button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-600 transition">
            Settings
          </button>
        </nav>

        <div className="p-4">
          <UserMenu />
        </div>

      </aside> */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">My Wallets</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {wallets.map((wallet, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{wallet.name}</h3>
              <p className="mt-2 text-gray-600">{wallet.balance}</p>
              <button className="mt-4 w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800 transition">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Add Wallet Button */}
        <div className="mt-8">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
            + Connect New Wallet
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
