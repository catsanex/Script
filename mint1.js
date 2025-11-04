import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL;
const PAY_TO = process.env.ADDRESS;
const NETWORK = process.env.NETWORK || "base";
const PORT = process.env.MINT1_PORT || 4022;

app.use(
  paymentMiddleware(
    PAY_TO,
    {
      "/mint-1nft": {
        price: "$5",
        network: NETWORK,
        description: "Pay 5 USDC to mint 1 x402mfer NFT",
      },
    },
    { url: FACILITATOR_URL }
  )
);

app.post("/mint-1nft", (req, res) => {
  res.json({ ok: true, message: "✅ Minted 1 NFT successfully." });
});

app.listen(PORT, () => console.log(`✅ Mint-1 server running on port ${PORT}`));
