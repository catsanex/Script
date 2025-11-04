import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL;
const PAY_TO = process.env.ADDRESS;
const NETWORK = process.env.NETWORK || "base";
const PORT = process.env.MINT10_PORT || 4023;

app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/mint-10nft": {
        price: "$50",
        network: NETWORK,
        description: "Pay 50 USDC to mint 10 x402mfer NFTs",
      },
    },
    { url: FACILITATOR_URL }
  )
);

app.post("/mint-10nft", (req, res) => {
  res.json({ ok: true, message: "✅ Minted 10 NFTs successfully." });
});

app.listen(PORT, () => console.log(`✅ Mint-10 server running on port ${PORT}`));
