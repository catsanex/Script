import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL;
const PAY_TO = process.env.ADDRESS;
const NETWORK = process.env.NETWORK || "base";
const PORT = process.env.MINT_PORT || 4021;

app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/mint": {
        price: "$5",
        network: NETWORK,
        description: "Pay 5 USDC to mint 1000 SANEX tokens",
      },
    },
    { url: FACILITATOR_URL }
  )
);

app.post("/mint", (req, res) => {
  res.json({ ok: true, message: "✅ Minted 1000 SANEX tokens successfully." });
});

app.listen(PORT, () => console.log(`✅ Mint server running on port ${PORT}`));
