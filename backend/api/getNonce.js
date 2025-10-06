// api/getNonce.js
export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // lightweight nonce: timestamp + random; NOT persisted (ok for dev/testing)
  // For production, store the nonce server-side (in Firestore with a service account) and mark used.
  const nonce = `cryptolocker-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return res.status(200).json({ nonce });
}
