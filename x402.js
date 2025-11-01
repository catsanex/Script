import express from "express";
import { config } from "./config.js";

const router = express.Router();

// === Helper untuk schema endpoint ===
function createSchema(resource, description, amount) {
  return {
    scheme: "exact",
    network: "base",
    asset: config.usdcAddress,
    maxAmountRequired: amount.toString(),
    payTo: config.payer,
    resource: `${config.publicBaseUrl}${resource}`,
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
      preferredFacilitator: "merit,coinbase,default",
      chainId: "8453",
      tokenAddress: config.erc20Address,
      tokenDecimals: "18",
      symbol: "USDC",
      assetName: "USD Coin",
      implementation: "merit-or-coinbase-facilitator"
    }
  };
}

// === Schema utama ===
const schema = {
  x402Version: 1,
  payer: config.payer,
  accepts: [
    createSchema(
      "/mint",
      "Mint ERC20 tokens on Base — pay 5 USDC then auto mint tokens",
      5
    ),
    createSchema(
      "/mint-bonus",
      "Mint BONUS tokens on Base — pay 10 USDC then auto mint double reward",
      10
    )
  ]
};

// === Routes ===
router.post("/", (req, res) => {
  res.status(402).type("application/json; charset=utf-8").json(schema);
});

router.get("/", (req, res) => {
  res.status(402).type("application/json; charset=utf-8").json(schema);
});

export default router;
