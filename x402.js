import express from "express";
import { config } from "./config.js";

const router = express.Router();

// Schema ini yg dibaca X402Scan sebelum klik Fetch.
// Coinbase Facilitator akan pakai field-field ini utk mengeksekusi pembayaran otomatis.
const schema = {
  x402Version: 1,
  payer: config.payer,
  accepts: [
    {
      scheme: "exact",
      network: "base",
      asset: config.usdcAddress,           // USDC Base
      maxAmountRequired: "5",              // string (VALIDASI x402)
      payTo: config.payer,                 // wallet kamu
      resource: "https://catsanex.up.railway.app//mint", // ganti setelah deploy (contoh: https://catsanex.up.railway.app/mint)
      description: "One-click mint on Base — pay 5 USDC and auto mint tokens",
      mimeType: "application/json; charset=utf-8",
      maxTimeoutSeconds: 600,              // number (OK)
      outputSchema: {
        input: {
          type: "http",
          method: "POST",
          bodyType: "json",
          // Coinbase Facilitator akan mengirim header ini saat callback sesudah bayar
          headerFields: {
            "x-402-payment": {
              type: "string",
              required: true,
              description: "On-chain payment tx hash (USDC transfer)"
            },
            "x-402-payer": {
              type: "string",
              required: true,
              description: "User wallet that paid"
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
        chainId: config.chainId,                 // string
        tokenAddress: config.erc20Address,
        tokenDecimals: "18",                     // string agar aman utk validator
        symbol: "USDC",
        assetName: "USD Coin",
        preferredFacilitator: "coinbase",        // ⭐ minta Coinbase Facilitator
        implementation: "coinbase-facilitator"   // label informatif
      }
    }
  ]
};

router.post("/", (req, res) => res.status(402).type("application/json; charset=utf-8").json(schema));
router.get("/",  (req, res) => res.status(402).type("application/json; charset=utf-8").json(schema));

export default router;
