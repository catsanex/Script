import express from "express";
import axios from "axios";

const router = express.Router();

// 🔹 Base configuration
const FACILITATOR_URL =
  process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const NETWORK = process.env.NETWORK || "base";
const RECEIVER = process.env.RECEIVER || "0x4E021C6b12e2574ce786E6Eacc3B2f863B9bc941"; // your wallet
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// 🔹 Primary mint route (x402-compatible)
router.post("/", async (req, res) => {
  try {
    const paymentTx = req.headers["x-402-payment"];
    const payer = req.headers["x-402-payer"];

    // Step 1: No payment yet → respond with 402 schema
    if (!paymentTx) {
      return res.status(402).json({
        x402Version: 1,
        payer: RECEIVER,
        accepts: [
          {
            scheme: "exact",
            network: NETWORK,
            asset: USDC,
            maxAmountRequired: "1",
            payTo: RECEIVER,
            resource: `https://catsanex.up.railway.app/mint`,
            description: "Pay 5 USDC via facilitator to mint tokens automatically",
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
                    description: "On-chain payment transaction hash"
                  },
                  "x-402-payer": {
                    type: "string",
                    required: true,
                    description: "Wallet address of user that made payment"
                  }
                }
              },
              output: {
                ok: "boolean",
                paymentTx: "string",
                mintTx: "string",
                to: "string",
                mintedAmount: "string"
              }
            },
            extra: {
              project: "Sanex Mint",
              chainId: "8453",
              tokenAddress: "0xC729777d0470F30612B1564Fd96E8Dd26f5814E3",
              tokenDecimals: "18",
              symbol: "USDC",
              preferredFacilitator: "coinbase,payai",
              implementation: "coinbase-facilitator"
            }
          }
        ]
      });
    }

    // Step 2: Payment detected — verify via Facilitator
    const verify = await axios.post(`${FACILITATOR_URL}/api/${NETWORK}/verify`, {
      txHash: paymentTx,
      expectedReceiver: RECEIVER,
      expectedAmount: "0.01",
      asset: USDC
    });

    if (!verify.data.valid)
      throw new Error("Facilitator verification failed: invalid transaction");

    console.log("✅ Facilitator verified payment from", payer);

    // Step 3: Mint success (mock)
    const mintTx = "0x" + crypto.randomUUID().replace(/-/g, "").slice(0, 64);
    return res.json({
      ok: true,
      message: "Payment verified via facilitator and tokens minted",
      paymentTx,
      mintTx,
      to: payer,
      mintedAmount: "1000"
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(400).json({ ok: false, error: err.message });
  }
});

// 🔹 Test GET
router.get("/", (req, res) => {
  res.send(`
    <h2>✅ Sanex Mint x402 (Facilitator integrated)</h2>
    <p>Use <code>POST /mint</code> to trigger facilitator payment via x402scan.com</p>
  `);
});

export default router;
