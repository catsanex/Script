import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

// 🔹 Base configuration
const FACILITATOR_URL =
  process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const NETWORK = process.env.NETWORK || "base";
const RECEIVER =
  process.env.RECEIVER ||
  "0x4E021C6b12e2574ce786E6Eacc3B2f863B9bc941"; // wallet penerima mint
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// =============================================================
// 🔹 Utility: Generate 402 Response Schema
// =============================================================
const generate402Schema = (resource, amount, description) => ({
  x402Version: 1,
  payer: RECEIVER,
  accepts: [
    {
      scheme: "exact",
      network: NETWORK,
      asset: USDC,
      maxAmountRequired: String(amount),
      payTo: RECEIVER,
      resource,
      description,
      mimeType: "application/json; charset=utf-8",
      maxTimeoutSeconds: 10,
      outputSchema: {
        input: {
          type: "http",
          method: "POST",
          bodyType: "json",
          headerFields: {
            "x-402-payment": {
              type: "string",
              required: true,
              description: "On-chain payment transaction hash",
            },
            "x-402-payer": {
              type: "string",
              required: true,
              description: "Wallet address of user that made payment",
            },
          },
        },
        output: {
          ok: "boolean",
          paymentTx: "string",
          mintTx: "string",
          to: "string",
          mintedAmount: "string",
        },
      },
      extra: {
        project: "Sanex Mint",
        chainId: "8453",
        tokenAddress: "0xC729777d0470F30612B1564Fd96E8Dd26f5814E3",
        tokenDecimals: "18",
        symbol: "USDC",
        preferredFacilitator: "coinbase,payai",
        implementation: "coinbase-facilitator",
      },
    },
  ],
});

// =============================================================
// 🔹 Core Mint Handler
// =============================================================
async function handleMint(req, res, mintAmount, usdcFee) {
  try {
    const paymentTx = req.headers["x-402-payment"];
    const payer = req.headers["x-402-payer"];

    // Step 1: Request 402 schema if no payment header
    if (!paymentTx) {
      return res.status(402).json(
        generate402Schema(
          `https://catsanex.up.railway.app${req.originalUrl}`,
          usdcFee,
          `Pay ${usdcFee} USDC via facilitator to mint ${mintAmount} SANEX tokens`
        )
      );
    }

    // Step 2: Verify payment with facilitator
    const verify = await axios.post(`${FACILITATOR_URL}/api/${NETWORK}/verify`, {
      txHash: paymentTx,
      expectedReceiver: RECEIVER,
      expectedAmount: String(usdcFee),
      asset: USDC,
    });

    if (!verify.data.valid)
      throw new Error("Facilitator verification failed: invalid transaction");

    console.log(`✅ Facilitator verified ${payer} payment (${usdcFee} USDC)`);

    // Step 3: Simulate minting
    const mintTx = "0x" + crypto.randomUUID().replace(/-/g, "").slice(0, 64);

    return res.json({
      ok: true,
      message: `Successfully minted ${mintAmount} SANEX tokens`,
      paymentTx,
      mintTx,
      to: payer,
      mintedAmount: mintAmount.toString(),
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(400).json({ ok: false, error: err.message });
  }
}

// =============================================================
// 🔹 API Routes
// =============================================================

// Main mint (default)
router.post("/", (req, res) => handleMint(req, res, 1000, 5));

// Mint 1 NFT
router.post("/mint-1nft", (req, res) => handleMint(req, res, 1, 5));

// Mint 10 NFT
router.post("/mint-10nft", (req, res) => handleMint(req, res, 10, 50));

// Check minted percentage (dummy)
router.post("/minted-percent", (req, res) => {
  const mintedPercent = (Math.random() * 100).toFixed(2);
  res.json({
    ok: true,
    mintedPercent,
    totalMinted: (mintedPercent * 1000).toFixed(0),
    totalSupply: 100000,
  });
});

// =============================================================
// 🔹 Web UI (GET /)
// =============================================================
router.get("/", (req, res) => {
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
      <h2>🪙 Sanex Mint — x402 Facilitator Integration</h2>
      <p>
        Selamat datang di halaman mint resmi <strong>Sanex Token</strong>!  
        Gunakan integrasi <code>x402scan.com</code> untuk membayar mint fee secara otomatis
        melalui facilitator seperti <strong>PayAI</strong> atau <strong>Coinbase Facilitator</strong>.
      </p>

      <div class="note">
        <strong>Deskripsi:</strong><br>
        Bayar <b>5 USDC</b> untuk melakukan mint otomatis 1.000 token SANEX ke wallet Anda.  
        Proses ini sepenuhnya on-chain dan diverifikasi melalui jaringan <code>Base</code>.
      </div>

      <div class="steps">
        <h3>🧾 Langkah-langkah Mint:</h3>
        <ol>
          <li>Klik tombol <b>Connect Wallet</b> di x402scan.</li>
          <li>Lakukan pembayaran 5 USDC ke alamat penerima.</li>
          <li>Setelah transaksi diverifikasi oleh facilitator, token otomatis dikirim ke wallet Anda.</li>
          <li>Lihat status mint di endpoint <code>/minted-percent</code>.</li>
        </ol>
      </div>

      <p style="margin-top: 20px;">
        Endpoint aktif:  
        <br/>🔹 <code>POST /mint</code> — mint 1000 token  
        <br/>🔹 <code>POST /mint-1nft</code> — mint 1 NFT  
        <br/>🔹 <code>POST /mint-10nft</code> — mint 10 NFT  
        <br/>🔹 <code>POST /minted-percent</code> — cek progress mint  
      </p>
    </div>
  `);
});

export default router;
