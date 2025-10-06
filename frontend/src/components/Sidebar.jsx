import { useState } from "react";
import UserMenu from "./UserMenu";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Settings", href: "/settings" },
    { name: "Wallets", href: "/wallets" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden bg-indigo-700 text-white w-full flex items-center justify-between p-4 shadow-md fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">RupeeLocker</h1>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="relative w-8 h-8 flex flex-col justify-between items-center z-50"
        >
          <span className={`block absolute w-8 h-0.5 bg-white transition-transform duration-300 ${mobileNavOpen ? "rotate-45 top-3.5" : "top-1"}`}></span>
          <span className={`block absolute w-8 h-0.5 bg-white transition-opacity duration-300 ${mobileNavOpen ? "opacity-0" : "top-3.5"}`}></span>
          <span className={`block absolute w-8 h-0.5 bg-white transition-transform duration-300 ${mobileNavOpen ? "-rotate-45 top-3.5" : "bottom-1"}`}></span>
        </button>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-full bg-indigo-700 z-40 transform transition-transform duration-300 md:hidden ${mobileNavOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button
          onClick={() => setMobileNavOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl font-bold"
        >
          ✕
        </button>

        <nav className="flex flex-col items-start mt-20 ml-6 space-y-6 text-white text-xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => `w-full text-left px-4 py-3 rounded transition ${isActive ? "bg-indigo-600" : "hover:bg-indigo-600"}`}
              onClick={() => setMobileNavOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-6">
          <UserMenu />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-indigo-700 text-white p-6 justify-between ">
        <nav className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            RupeeLocker
          </h1>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => `text-left px-4 py-2 rounded transition ${isActive ? "bg-indigo-600" : "hover:bg-indigo-600"}`}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <UserMenu />
        </div>
      </aside>
    </>
  );
}

