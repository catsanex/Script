import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.MINTED_PORT || 4024;

app.post("/minted-percent", (req, res) => {
  const minted = (Math.random() * 100).toFixed(2);
  res.json({
    ok: true,
    mintedPercent: minted,
    totalMinted: (minted * 1000).toFixed(0),
    totalSupply: 100000,
  });
});

app.listen(PORT, () => console.log(`✅ Minted-percent server running on port ${PORT}`));
