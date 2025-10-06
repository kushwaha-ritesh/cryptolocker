import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to landing page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
      className="relative w-full"
    >
      {/* User button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 w-full rounded transition-colors duration-200
          ${open ? "bg-gray-200 text-black" : "bg-gray-100 text-gray-800"} hover:bg-gray-300 hover:text-black`}
      >
        <img
          src="https://ui-avatars.com/api/?name=You"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="flex-1 text-left font-medium">You</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute left-0 bottom-full w-40 bg-white border rounded shadow z-50 -translate-y-1">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 hover:text-red-700 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
