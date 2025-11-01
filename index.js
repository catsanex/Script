import express from "express";
import cors from "cors";
import x402Router from "./x402.js"; // ini file schema 402
import mintRouter from "./mint.js"; // endpoint mint utama
import mintBonusRouter from "./mint-bonus.js"; // endpoint mint bonus

const app = express();
app.use(cors());
app.use(express.json());

// ===================
// 🔹 ROUTES REGISTER
// ===================
app.use("/api/x402", x402Router);     // schema endpoint (x402scan)
app.use("/mint", mintRouter);         // endpoint mint 5 USDC
app.use("/mint-bonus", mintBonusRouter); // endpoint mint $0.01

// Default homepage
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Sanex x402 API Active</h2>
    <ul>
      <li><a href="/api/x402">/api/x402</a> → schema for x402scan.com</li>
      <li><a href="/mint">/mint</a> → main mint endpoint (5 USDC)</li>
      <li><a href="/mint-bonus">/mint-bonus</a> → bonus mint endpoint ($0.01)</li>
    </ul>
  `);
});

// ===================
// 🔹 START SERVER
// ===================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
