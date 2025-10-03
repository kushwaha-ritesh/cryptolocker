// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithEmail, signInWithGoogle, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
// ethers will be dynamically imported inside the wallet flow to avoid static import issues

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailLogin() {
    setLoading(true)
    try {
      const user = await loginWithEmail(email, password)
      if (user) navigate('/dashboard')
    } catch (err) {
      console.error('Email login error', err)
      alert('Failed to login with email: ' + (err.message || err))
    } finally { setLoading(false) }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      if (user) navigate('/dashboard')
    } catch (err) {
      console.error('Google login error', err)
      alert('Failed to login with Google: ' + (err.message || err))
    } finally { setLoading(false) }
  }

  async function handleWalletLogin() {
    if (!window.ethereum) return alert('Install MetaMask')
    setLoading(true)
    try {
      // Request accounts in a compatible way
      if (window.ethereum.request) await window.ethereum.request({ method: 'eth_requestAccounts' })
      else if (window.ethereum.enable) await window.ethereum.enable()

      // Dynamically load ethers to avoid bundler/export issues
      const mod = await import('ethers')
      let address
      if (mod && mod.ethers && mod.ethers.BrowserProvider) {
        // Some environments expose `ethers` namespace
        const provider = new mod.ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        address = await signer.getAddress()
      } else if (mod && mod.BrowserProvider) {
        // ESM default export may expose BrowserProvider directly
        const provider = new mod.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        address = await signer.getAddress()
      } else if (mod && mod.providers && mod.providers.Web3Provider) {
        // ethers v5 style
        const provider = new mod.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        address = await signer.getAddress()
      } else {
        // fallback to direct provider accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        address = accounts && accounts[0]
      }

      if (!address) throw new Error('No wallet address')

      // Ensure user exists in Firestore
      const userRef = doc(db, 'users', address)
      const userSnap = await getDoc(userRef)
      if (!userSnap.exists()) {
        await setDoc(userRef, { wallet: address, createdAt: new Date(), wallets: [address] })
      }

      navigate('/dashboard')
    } catch (err) {
      console.error('Wallet login error', err)
      alert('Wallet login failed: ' + (err.message || err))
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Login</h2>

        <input type="email" placeholder="Email" className="w-full mb-4 p-3 border rounded-lg" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-4 p-3 border rounded-lg" value={password} onChange={e => setPassword(e.target.value)} />

        <button onClick={handleEmailLogin} disabled={loading} className="w-full bg-indigo-700 text-white py-3 rounded-lg mb-4 hover:bg-indigo-800 transition">Login with Email</button>

        <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white border border-indigo-700 text-indigo-700 py-3 rounded-lg mb-4 hover:bg-gray-100 transition">Login with Google</button>

        <button onClick={handleWalletLogin} disabled={loading} className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition">Login with Wallet</button>

        <p className="mt-4 text-center text-gray-500">Don't have an account? <span onClick={() => navigate('/signup')} className="text-indigo-700 font-semibold cursor-pointer">Sign Up</span></p>
      </div>
    </div>
  )
}
