import express from "express";
import cors from "cors";
import x402Router from "./x402.js";
import mintRouter from "./mint.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/x402", x402Router);
app.use("/mint", mintRouter);

app.get("/", (req, res) => {
  res.send(`<h2>✅ Sanex X402 API Live</h2>
            <p>Schema: <code>POST /api/x402</code></p>
            <p>Paid Action: <code>POST /mint</code> (callback by facilitator)</p>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
