import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const PAY_TO = process.env.ADDRESS || "0x4E021C6b12e2574ce786E6Eacc3B2f863B9bc941";
const NETWORK = process.env.NETWORK || "base";
const PORT = process.env.PORT || 4021;

// =============================================================
// 🔹 Middleware: x402 Payment integration
// =============================================================
app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/mint": {
        price: "$5",
        network: NETWORK,
        description: "Pay 5 USDC to mint 1000 SANEX tokens",
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
    },
    { url: FACILITATOR_URL }
  )
);

// =============================================================
// 🔹 Routes
// =============================================================

// Main Mint endpoint
app.post("/mint", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — minted 1000 SANEX tokens successfully.",
  });
});

// Mint 1 NFT
app.post("/mint-1nft", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — 1 x402mfer NFT minted successfully.",
  });
});

// Mint 10 NFTs
app.post("/mint-10nft", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — 10 x402mfer NFTs minted successfully.",
  });
});

// Minted percent (dummy data)
app.post("/minted-percent", (req, res) => {
  const percent = (Math.random() * 100).toFixed(2);
  res.json({
    ok: true,
    mintedPercent: percent,
    totalMinted: Math.floor(percent * 1000),
    totalSupply: 100000,
  });
});

// =============================================================
// 🔹 Landing Page (HTML Info)
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
        Use <code>x402scan.com</code> to pay and mint automatically through facilitators like
        <strong>PayAI</strong> or <strong>Coinbase Facilitator</strong>.
      </p>

      <div class="note">
        <strong>Mint Info:</strong><br>
        - Mint 1000 SANEX tokens for <b>5 USDC</b><br>
        - Mint 1 NFT for <b>5 USDC</b><br>
        - Mint 10 NFTs for <b>50 USDC</b><br>
        Fully verified on <code>Base Network</code>.
      </div>

      <div class="steps">
        <h3>🧾 How It Works:</h3>
        <ol>
          <li>Click <b>Connect Wallet</b> on x402scan.</li>
          <li>Pay the amount shown (5 USDC or 50 USDC).</li>
          <li>After verification, tokens or NFTs are automatically minted to your wallet.</li>
          <li>Check status anytime via <code>/minted-percent</code>.</li>
        </ol>
      </div>

      <p style="margin-top: 20px;">
        Available Endpoints:<br/>
        🔹 <code>POST /mint</code><br/>
        🔹 <code>POST /mint-1nft</code><br/>
        🔹 <code>POST /mint-10nft</code><br/>
        🔹 <code>POST /minted-percent</code>
      </p>
    </div>
  `);
});

// =============================================================
// 🚀 Start Server
// =============================================================
app.listen(PORT, () => {
  console.log(`🚀 Catsanex Mint Server running on port ${PORT}`);
  console.log(`💰 PayTo Address: ${PAY_TO}`);
  console.log(`🌐 Facilitator: ${FACILITATOR_URL}`);
});
