import express from "express";
import { paymentMiddleware } from "x402-express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.MINT1_PORT || 4022;
const PAY_TO = process.env.ADDRESS;
const NETWORK = process.env.NETWORK || "base";
const FACILITATOR_URL = process.env.FACILITATOR_URL;

// ✅ Middleware hanya untuk route ini
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

// ✅ Route mint-1nft
app.post("/mint-1nft", (req, res) => {
  res.json({
    ok: true,
    message: "✅ Payment verified — 1 x402mfer NFT minted successfully.",
  });
});

app.listen(PORT, () =>
  console.log(`✅ /mint-1nft server running on port ${PORT}`)
);
