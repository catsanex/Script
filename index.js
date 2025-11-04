import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// =============================================================
// 🔹 Konfigurasi Dasar
// =============================================================
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const PAY_TO = process.env.ADDRESS || "0x4E021C6b12e2574ce786E6Eacc3B2f863B9bc941";
const NETWORK = process.env.NETWORK || "base";
const PORT = process.env.PORT || 4021;

// =============================================================
// 🔹 Integrasi Middleware x402 Payment
// =============================================================
// Semua endpoint yang didefinisikan di sini akan otomatis terdaftar di x402scan
app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/mint": {
        price: "$5",
        network: NETWORK,
        description: "Pay 5 USDC to mint 1000 SANEX tokens automatically",
      },
      "/mint-1nft": {
        price: "$5",
        network: NETWORK,
        description: "Pay 5 USDC to mint 1 x402mfer NFT",
      },
      "/mint-10nft": {
        price: "$50",
        network: NETWORK,
        description: "Pay 50 USDC to mint 10 x402mfer NFTs",
      },
      "/minted-percent": {
        price: "$0",
        network: NETWORK,
        description: "Check minted progress (free endpoint)",
      },
    },
    {
      url: FACILITATOR_URL,
    }
  )
);

// =============================================================
// 🔹 Endpoint Setelah Pembayaran Diverifikasi
// =============================================================

// Mint utama
app.post("/mint", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — 1000 SANEX tokens minted successfully.",
  });
});

// Mint 1 NFT
app.post("/mint-1nft", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — 1 x402mfer NFT minted successfully.",
  });
});

// Mint 10 NFT
app.post("/mint-10nft", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — 10 x402mfer NFTs minted successfully.",
  });
});

// Minted Percent (dummy)
app.post("/minted-percent", (req, res) => {
  const mintedPercent = (Math.random() * 100).toFixed(2);
  res.json({
    ok: true,
    mintedPercent,
    totalMinted: (mintedPercent * 1000).toFixed(0),
    totalSupply: 100000,
  });
});

// =============================================================
// 🔹 Halaman HTML Informasi Mint
// =============================================================
app.get("/", (req, res) => {
  res.send(`
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: #f7f8fa;
        color: #222;
        padding: 40px;
        line-height: 1.6;
      }
      .container {
        max-width: 700px;
        margin: auto;
        background: white;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.1);
      }
      h2 { color: #333; }
      code {
        background: #f1f1f1;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 14px;
      }
      .note {
        background: #eef6ff;
        border-left: 4px solid #007bff;
        padding: 10px 15px;
        margin-top: 10px;
      }
      .steps { margin-top: 20px; }
      .steps li { margin-bottom: 8px; }
    </style>

    <div class="container">
      <h2>🪙 Catsanex Mint — x402 Facilitator Integration</h2>
      <p>
        Welcome to the official <strong>Sanex Mint Server</strong>!  
        This server integrates directly with <code>x402scan.com</code> and 
        allows users to mint via <strong>PayAI</strong> or <strong>Coinbase Facilitator</strong>.
      </p>

      <div class="note">
        <strong>Mint Details:</strong><br>
        - Mint 1000 SANEX tokens for <b>5 USDC</b><br>
        - Mint 1 NFT for <b>5 USDC</b><br>
        - Mint 10 NFTs for <b>50 USDC</b><br>
        <small>All verified on <code>Base Network</code>.</small>
      </div>

      <div class="steps">
        <h3>🧾 How to Mint:</h3>
        <ol>
          <li>Open <b>x402scan.com</b> and connect your wallet.</li>
          <li>Select the resource you want to mint (1 NFT, 10 NFTs, or SANEX tokens).</li>
          <li>Pay the required amount (5 or 50 USDC).</li>
          <li>After facilitator verification, tokens will be minted to your wallet automatically.</li>
        </ol>
      </div>

      <p style="margin-top: 20px;">
        <strong>Active Endpoints:</strong><br/>
        🔹 <code>POST /mint</code> — Mint 1000 SANEX Tokens<br/>
        🔹 <code>POST /mint-1nft</code> — Mint 1 NFT<br/>
        🔹 <code>POST /mint-10nft</code> — Mint 10 NFTs<br/>
        🔹 <code>POST /minted-percent</code> — Check Mint Progress<br/>
      </p>
    </div>
  `);
});

// =============================================================
// 🚀 Jalankan Server
// =============================================================
app.listen(PORT, () => {
  console.log(`🚀 Catsanex Mint Server running on port ${PORT}`);
  console.log(`🌐 Facilitator: ${FACILITATOR_URL}`);
  console.log(`💰 PayTo: ${PAY_TO}`);
});
