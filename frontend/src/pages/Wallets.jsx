import React, { useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useSignMessage,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, arbitrum, optimism, bsc } from "wagmi/chains";
import Sidebar from "../components/Sidebar";
// WalletPage.jsx
// Compatible with wagmi v1+ and RainbowKit

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address,
    watch: true,
  });
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains: availableChains, switchChain } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const [linkedWallets, setLinkedWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const supportedChains = [mainnet, polygon, arbitrum, optimism, bsc];
  const activeChain = supportedChains.find((c) => c.id === chainId);

  useEffect(() => {
    async function fetchLinked() {
      try {
        const resp = await Promise.resolve({ json: () => [] });
        const data = await resp.json();
        setLinkedWallets(data);
      } catch (e) {
        console.error("Failed to fetch linked wallets", e);
      }
    }
    fetchLinked();
  }, []);

  async function handleLinkWallet() {
    setError(null);
    if (!isConnected || !address) {
      setError("Connect a wallet first using the Connect button.");
      return;
    }

    setLoading(true);
    try {
      const challenge = `Link wallet ${address} to RupeeLocker — timestamp: ${Date.now()}`;
      const sig = await signMessageAsync({ message: challenge });

      const saveResp = await fetch("/api/linked-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, chainId, challenge, sig }),
      });

      if (!saveResp.ok) throw new Error("Failed to save linked wallet");
      const saved = await saveResp.json();

      setLinkedWallets((prev) => [
        ...prev,
        { address, chain: activeChain?.name || "unknown", id: saved?.id || Date.now() },
      ]);
    } catch (e) {
      console.error(e);
      setError(e.message || "Could not link wallet");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelink(idOrAddress) {
    setLinkedWallets((prev) => prev.filter((w) => w.id !== idOrAddress && w.address !== idOrAddress));
    try {
      await fetch(`/api/linked-wallets/${idOrAddress}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Failed to delete from server; local state updated", e);
    }
  }

  function handleSwitchChain(targetChainId) {
    if (!switchChain) {
      setError("Wallet or provider does not support programmatic chain switching.");
      return;
    }
    switchChain({ chainId: targetChainId });
  }

  return (
    <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Wallets & Connections</h1>
          <div className="flex gap-4 items-center">
            <ConnectButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-4 border rounded-2xl shadow-sm">
            <h2 className="text-lg font-medium mb-3">Active Connection</h2>
            {isConnected ? (
              <div>
                <p className="text-sm md:break-words">Address: <span className="font-mono">{address}</span></p>
                <p className="text-sm">Network: <span className="font-medium">{activeChain?.name || "Unknown"}</span></p>
                <p className="text-sm">
                  Balance: <span className="font-mono">{balanceData ? `${balanceData.formatted} ${balanceData.symbol}` : "—"}</span>
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="px-3 py-1 rounded-md border hover:bg-gray-50"
                    onClick={() => refetchBalance()}
                  >
                    Refresh Balance
                  </button>
                  <button
                    className="px-3 py-1 rounded-md bg-red-50 border border-red-200 text-red-700"
                    onClick={() => disconnect()}
                  >
                    Disconnect
                  </button>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Switch Blockchain</h3>
                  <div className="flex gap-2 flex-wrap">
                    {supportedChains.map((c) => (
                      <button
                        key={c.id}
                        className={`px-3 py-1 rounded-md border ${chainId === c.id ? "bg-gray-100" : "hover:bg-gray-50"}`}
                        onClick={() => handleSwitchChain(c.id)}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow-sm disabled:opacity-50"
                    onClick={handleLinkWallet}
                    disabled={loading}
                  >
                    {loading ? "Linking..." : "Link this wallet to my account"}
                  </button>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No wallet connected. Use the Connect button to connect.</p>
            )}
          </section>

          <section className="p-4 border rounded-2xl shadow-sm">
            <h2 className="text-lg font-medium mb-3">Linked Wallets</h2>
            <p className="text-sm text-gray-600 mb-3">Wallets you've linked to your RupeeLocker account (saved server-side).</p>

            {linkedWallets.length === 0 ? (
              <div className="text-sm text-gray-500">No linked wallets yet. Link a wallet from the active connection panel.</div>
            ) : (
              <ul className="space-y-3">
                {linkedWallets.map((w) => (
                  <li key={w.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <div className="font-mono">{w.address}</div>
                      <div className="text-xs text-gray-500">{w.chain}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded-md border"
                        onClick={() => navigator.clipboard?.writeText(w.address)}
                      >
                        Copy
                      </button>
                      <button
                        className="px-2 py-1 rounded-md border bg-red-50 text-red-600"
                        onClick={() => handleDelink(w.id || w.address)}
                      >
                        Delink
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="mt-6 p-4 border rounded-2xl text-sm text-gray-600">
          <strong>Notes</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Uses wagmi v1+ API (useChainId, useSwitchChain).
            </li>
            <li>
              Linking multiple wallets requires a server to persist wallet entries and verify signatures. The example calls <code>/api/linked-wallets</code> as a placeholder.
            </li>
            <li>
              Programmatic chain switching requires wallet support. If unsupported, show instructions to switch manually.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}