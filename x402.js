import express from "express";
import { config } from "./config.js";

const router = express.Router();

const schema = {
  x402Version: 1,
  payer: config.payer,
  accepts: [
    {
      scheme: "exact",
      network: "base",
      asset: config.usdcAddress,
      maxAmountRequired: "5", // string (wajib)
      payTo: config.payer,
      resource: `${config.publicBaseUrl}/mint`, // callback paid action
      description: "One-click mint on Base — pay 5 USDC then auto mint tokens",
      mimeType: "application/json; charset=utf-8",
      maxTimeoutSeconds: 10,  // number oke
      outputSchema: {
        input: {
          type: "http",
          method: "POST",
          bodyType: "json",
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
        // ⭐ minta facilitator resmi: utamakan MERIT, fallback COINBASE
        preferredFacilitator: "merit,coinbase,default",
        chainId: "8453",
        tokenAddress: config.erc20Address,
        tokenDecimals: "18",
        symbol: "USDC",
        assetName: "USD Coin",
        implementation: "merit-or-coinbase-facilitator"
      }
    }
  ]
};

router.post("/", (req, res) =>
  res.status(402).type("application/json; charset=utf-8").json(schema)
);
router.get("/", (req, res) =>
  res.status(402).type("application/json; charset=utf-8").json(schema)
);

export default router;
