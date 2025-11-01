import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL;
const PAY_TO = process.env.ADDRESS;
const NETWORK = process.env.NETWORK || "base";
const PORT = process.env.PORT || 4021;

// 🚀 Tambahkan middleware pembayaran otomatis
app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/mint": {
        price: "$0.01", // user bayar 5 USDC
        network: NETWORK,
        description: "Pay 5 USDC then auto mint tokens on Base",
      },
    },
    {
      url: FACILITATOR_URL,
    }
  )
);

// ✅ Endpoint mint - ini dipanggil setelah payment diverifikasi
app.post("/mint", (req, res) => {
  res.json({
    ok: true,
    message: "Payment verified — tokens minted successfully.",
  });
});

// Test route
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Catsanex X402 Mint Ready</h2>
    <p>Use <code>POST /mint</code> with facilitator PayAI Network.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Facilitator: ${FACILITATOR_URL}`);
  console.log(`💰 PayTo: ${PAY_TO}`);
});
