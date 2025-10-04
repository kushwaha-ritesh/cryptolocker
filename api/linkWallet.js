// api/linkWallet.js
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { address, signature, nonce } = req.body;
    if (!address || !signature || !nonce) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // verify signature
    // ethers.verifyMessage exist in ethers v6 as ethers.verifyMessage; in v5 use ethers.utils.verifyMessage
    let recovered;
    try {
      // try v6 style
      recovered = ethers.verifyMessage ? ethers.verifyMessage(nonce, signature) : ethers.utils.verifyMessage(nonce, signature);
    } catch (e) {
      // fallback to v5 utils
      recovered = ethers.utils.verifyMessage(nonce, signature);
    }

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ success: false, error: "Signature mismatch", recovered });
    }

    // successful verification → generate walletId to store in Firestore from frontend
    const walletId = uuidv4();
    return res.status(200).json({ success: true, walletId });
  } catch (err) {
    console.error("linkWallet error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
