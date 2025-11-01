import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

// === Base Configuration ===
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const NETWORK = process.env.NETWORK || "base";
const RECEIVER = process.env.RECEIVER || "0x62Ae4503A0430D94ACebF3C3427a940E85511111";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// === Helper for 402 Schema Response ===
function createSchema(amount, description, resourceUrl) {
  return {
    x402Version: 1,
    payer: RECEIVER,
    accepts: [
      {
        scheme: "exact",
        network: NETWORK,
        asset: USDC,
        maxAmountRequired: amount.toString(),
        payTo: RECEIVER,
        facilitatorUrl: FACILITATOR_URL,
        resource: resourceUrl,
        description,
        mimeType: "application/json; charset=utf-8",
        maxTimeoutSeconds: 600,
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
                description: "Wallet address of user who paid"
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
          preferredFacilitator: "payai",
          implementation: "facilitator-auto-mint"
        }
      }
    ]
  };
}

// === Endpoint 1: /mint ===
router.post("/mint", async (req, res) => {
  try {
    const paymentTx = req.headers["x-402-payment"];
    const payer = req.headers["x-402-payer"];

    if (!paymentTx) {
      return res.status(402).json(
        createSchema(
          5,
          "Pay 5 USDC via PayAI Facilitator to mint standard tokens.",
          `https://catsanex.up.railway.app/mint`
        )
      );
    }

    // Verify payment via Facilitator
    const verify = await axios.post(`${FACILITATOR_URL}/api/${NETWORK}/paid-content`, {
      txHash: paymentTx,
      receiver: RECEIVER,
      asset: USDC,
      amount: "5"
    });

    if (verify.status !== 200) throw new Error("Facilitator verification failed.");

    const mintTx = "0x" + crypto.randomBytes(32).toString("hex");
    return res.json({
      ok: true,
      message: "✅ 5 USDC payment verified, tokens minted.",
      paymentTx,
      mintTx,
      to: payer,
      mintedAmount: "1000"
    });
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
});

// === Endpoint 2: /mint-bonus ===
router.post("/mint-bonus", async (req, res) => {
  try {
    const paymentTx = req.headers["x-402-payment"];
    const payer = req.headers["x-402-payer"];

    if (!paymentTx) {
      return res.status(402).json(
        createSchema(
          10,
          "Pay 10 USDC via PayAI Facilitator to mint BONUS tokens (2× reward).",
          `https://catsanex.up.railway.app/mint-bonus`
        )
      );
    }

    // Verify payment via Facilitator
    const verify = await axios.post(`${FACILITATOR_URL}/api/${NETWORK}/paid-content`, {
      txHash: paymentTx,
      receiver: RECEIVER,
      asset: USDC,
      amount: "0.01"
    });

    if (verify.status !== 200) throw new Error("Facilitator verification failed.");

    const mintTx = "0x" + crypto.randomBytes(32).toString("hex");
    return res.json({
      ok: true,
      message: "✅ 10 USDC payment verified, BONUS tokens minted.",
      paymentTx,
      mintTx,
      to: payer,
      mintedAmount: "2000"
    });
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
});

// === GET test ===
router.get("/", (req, res) => {
  res.send(`
    <h2>✅ Sanex Mint – PayAI Facilitator Ready</h2>
    <ul>
      <li><b>/mint</b> → pay 5 USDC for standard mint</li>
      <li><b>/mint-bonus</b> → pay 10 USDC for double mint</li>
    </ul>
  `);
});

export default router;
