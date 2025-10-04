// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, signInWithGoogle } from "../firebase"; // your firebase functions
import { ethers } from "ethers";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- Email/Password login ---
  const handleEmailLogin = async () => {
    try {
      const user = await loginWithEmail(email, password);
      if (user) navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to login with email");
    }
  };

  // --- Google Login ---
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to login with Google");
    }
  };

  // --- Wallet Login ---
  const handleWalletLogin = async () => {
    if (!window.ethereum) return alert("Install Metamask!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Check if user exists in Firebase
      const userRef = doc(db, "users", walletAddress);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Auto-create new user in Firestore with wallet as UID
        await setDoc(userRef, {
          wallet: walletAddress,
          createdAt: new Date(),
          wallets: [walletAddress],
        });
        console.log("New user created!");
      } else {
        console.log("Existing user logged in!");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Wallet login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Login</h2>

        {/* Email Login */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleEmailLogin}
          className="w-full bg-indigo-700 text-white py-3 rounded-lg mb-4 hover:bg-indigo-800 transition"
        >
          Login with Email
        </button>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-indigo-700 text-indigo-700 py-3 rounded-lg mb-4 hover:bg-gray-100 transition"
        >
          Login with Google
        </button>

        {/* Wallet Login */}
        <button
          onClick={handleWalletLogin}
          className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition"
        >
          Login with Wallet
        </button>

        <p className="mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-indigo-700 font-semibold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
