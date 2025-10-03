import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signUpWithEmail, signInWithGoogle, db } from "../firebase"
import { doc, getDoc, setDoc } from 'firebase/firestore'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleEmailSignup() {
    setError("")
    setLoading(true)
    try {
      const user = await signUpWithEmail(email, password)
      if (user) navigate("/dashboard")
    } catch (err) {
      console.error("Signup error", err)
      setError(err?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setError("")
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      if (user) navigate("/dashboard")
    } catch (err) {
      console.error("Google signup error", err)
      setError(err?.message || "Google signup failed")
    } finally {
      setLoading(false)
    }
  }

  async function ensureUserDoc(address) {
    const userRef = doc(db, 'users', address)
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      await setDoc(userRef, { wallet: address, createdAt: new Date(), wallets: [address] })
    }
  }

  async function connectWallet(providerName) {
    setError("")
    setLoading(true)
    try {
      if (providerName === 'metamask') {
        if (!window.ethereum) throw new Error('MetaMask not available')
        if (window.ethereum.request) await window.ethereum.request({ method: 'eth_requestAccounts' })
        const mod = await import('ethers')
        let address
        if (mod && (mod.BrowserProvider || (mod.ethers && mod.ethers.BrowserProvider))) {
          const Browser = mod.BrowserProvider || (mod.ethers && mod.ethers.BrowserProvider)
          const provider = new Browser(window.ethereum)
          const signer = await provider.getSigner()
          address = await signer.getAddress()
        } else if (mod && mod.providers && mod.providers.Web3Provider) {
          const provider = new mod.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          address = await signer.getAddress()
        } else {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          address = accounts && accounts[0]
        }
        if (!address) throw new Error('No wallet address')
        await ensureUserDoc(address)
        navigate('/dashboard')
        return
      }

      if (providerName === 'walletconnect') {
        const mod = await import('@walletconnect/ethereum-provider')
        const Provider = mod.default || mod.WalletConnectProvider || mod
        const wc = await Provider.init({ projectId: '' })
        await wc.request({ method: 'eth_requestAccounts' })
        const accounts = await wc.request({ method: 'eth_accounts' })
        const address = accounts && accounts[0]
        if (!address) throw new Error('No wallet address')
        await ensureUserDoc(address)
        navigate('/dashboard')
        return
      }

      if (providerName === 'coinbase') {
        try {
          const mod = await import('@coinbase/wallet-sdk')
          const CoinbaseWalletSDK = mod.default || mod.CoinbaseWalletSDK || mod
          const coinbase = new CoinbaseWalletSDK({ appName: 'RupeeLocker' })
          const provider = coinbase.makeWeb3Provider('https://mainnet.infura.io/v3/', 1)
          await provider.request({ method: 'eth_requestAccounts' })
          const accounts = await provider.request({ method: 'eth_accounts' })
          const address = accounts && accounts[0]
          if (!address) throw new Error('No wallet address')
          await ensureUserDoc(address)
          navigate('/dashboard')
          return
        } catch (inner) {
          // fallback to Coinbase extension provider
          if (window.ethereum && window.ethereum.isCoinbaseWallet) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const address = accounts && accounts[0]
            if (address) { await ensureUserDoc(address); navigate('/dashboard'); return }
          }
          throw new Error('Coinbase connect failed')
        }
      }
    } catch (err) {
      console.error('Wallet connect failed', err)
      setError(err?.message || 'Wallet connect failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Sign Up</h2>

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
          onClick={handleEmailSignup}
          disabled={loading}
          className="w-full bg-indigo-700 text-white py-3 rounded-lg mb-4 hover:bg-indigo-800 transition"
        >
          Sign Up with Email
        </button>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-white border border-indigo-700 text-indigo-700 py-3 rounded-lg mb-4 hover:bg-gray-100 transition"
        >
          Sign Up with Google
        </button>

        <div className="flex gap-2">
          <button onClick={() => connectWallet('metamask')} disabled={loading} className="flex-1 px-3 py-2 bg-yellow-500 rounded">MetaMask</button>
          <button onClick={() => connectWallet('walletconnect')} disabled={loading} className="flex-1 px-3 py-2 bg-green-600 rounded">WalletConnect</button>
        </div>
        <button onClick={() => connectWallet('coinbase')} disabled={loading} className="w-full mt-3 px-3 py-2 bg-sky-600 rounded">Coinbase</button>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <p className="mt-4 text-center text-gray-500">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-indigo-700 font-semibold cursor-pointer">Log in</span>
        </p>
      </div>
    </div>
  )
}
