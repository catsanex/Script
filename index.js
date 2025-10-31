import express from "express";
import { config } from "dotenv";
import { paymentMiddleware } from "x402-express";

config();

const app = express();

// ======================
// ✅ ENV CONFIG
// ======================
const facilitatorUrl = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const payTo = process.env.ADDRESS || "0x62Ae4503A0430D94ACebF3C3427a940E85511111"; // ganti ke wallet kamu

if (!facilitatorUrl || !payTo) {
  console.error("❌ Missing environment variables FACILITATOR_URL or ADDRESS");
  process.exit(1);
}

// ======================
// ✅ MIDDLEWARE X402
// ======================
app.use(
  paymentMiddleware(
    payTo,
    {
      // 🔹 Endpoint publik pertama — cuaca
      "GET /weather": {
        price: "$0.001", // 0.001 USDC
        network: "base", // ubah ke base mainnet
      },
      // 🔹 Endpoint premium — bisa apa saja, misalnya /mint atau /premium/*
      "POST /mint": {
        price: "$5.00", // 5 USDC
        network: "base",
      },
    },
    {
      url: facilitatorUrl, // ← gunakan facilitator default PayAI
    }
  )
);

// ======================
// ✅ ROUTES
// ======================
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ X402-PayAI Facilitator Active</h2>
    <p>Use <code>POST /mint</code> to test auto-pay with 5 USDC</p>
  `);
});

app.get("/weather", (req, res) => {
  res.json({
    weather: "☀️ Sunny",
    temperature: "31°C",
    location: "Jakarta, Indonesia",
  });
});

app.post("/mint", (req, res) => {
  res.json({
    ok: true,
    message: "Payment verified and mint simulated!",
    tx: "0xMockedMintTxHash",
  });
});

// ======================
// ✅ START SERVER
// ======================
const port = process.env.PORT || 4021;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`💰 Facilitator: ${facilitatorUrl}`);
});
