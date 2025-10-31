import express from "express";
import cors from "cors";
import mintRouter from "./mint.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <h1>✅ Sanex X402 Mint API</h1>
    <p>Server running on Base — integrated with x402 Facilitator.</p>
    <ul>
      <li><a href="/mint">/mint</a> → x402 endpoint</li>
    </ul>
  `);
});

app.use("/mint", mintRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));
