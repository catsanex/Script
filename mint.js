import express from "express";
import { ethers } from "ethers";
import { provider, wallet } from "./ethers.js";
import { config } from "./config.js";

const router = express.Router();

const USDC = config.usdcAddress;
const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)"
];
const TOKEN_ABI = ["function mint(address to, uint256 amount) public returns (bool)"];

const usdc = new ethers.Contract(USDC, ERC20_ABI, provider);
const token = new ethers.Contract(config.erc20Address, TOKEN_ABI, wallet);

// Verifikasi bahwa txHash adalah transfer 5 USDC → payTo (config.payer)
async function verifyPaymentExact5USDCToPayee(txHash) {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt || receipt.status !== 1) throw new Error("Invalid or unconfirmed transaction");

  const iface = new ethers.Interface(ERC20_ABI);
  const dec = await usdc.decimals();
  const required = ethers.parseUnits("5", dec);

  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed.name !== "Transfer") continue;

      const to = parsed.args.to?.toLowerCase();
      const val = parsed.args.value;

      if (to === config.payer.toLowerCase() && val === required) {
        // from = wallet user yg bayar
        const from = parsed.args.from;
        return { payerFrom: from, amount: ethers.formatUnits(val, dec) };
      }
    } catch { /* skip non-USDC logs */ }
  }
  throw new Error("Payment of exactly 5 USDC to payTo not detected");
}

router.post("/", async (req, res) => {
  const paymentTx = req.headers["x-402-payment"];
  const payer = req.headers["x-402-payer"]; // informasi dari facilitator (asal user)

  // Jika belum ada pembayaran → kembalikan 402 schema (untuk “manual call” / curl)
  if (!paymentTx) {
    return res
      .status(402)
      .type("application/json; charset=utf-8")
      .json({
        x402Version: 1,
        payer: config.payer,
        accepts: [
          {
            scheme: "exact",
            network: "base",
            asset: USDC,
            maxAmountRequired: "5",
            payTo: config.payer,
            resource: "https://catsanex.up.railway.app//mint",
            description: "Pay 5 USDC then auto-mint tokens",
            mimeType: "application/json; charset=utf-8",
            maxTimeoutSeconds: 600,
            // headerFields sudah didefinisikan di /api/x402; optional untuk echo disini
          }
        ]
      });
  }

  try {
    // 1) Verifikasi pembayaran 5 USDC ke payTo
    const { payerFrom, amount } = await verifyPaymentExact5USDCToPayee(paymentTx);

    // 2) Hitung jumlah mint (mis: 1 USDC → 200 token)
    const mintAmount = ethers.parseUnits(
      String(Number(amount) * config.mintPerUsdc),
      18
    );

    // 3) Tujuan mint = si pembayar (prioritas: header x-402-payer, fallback ke log 'from')
    const toAddress = (payer || payerFrom);

    // 4) Mint token
    const tx = await token.mint(toAddress, mintAmount);
    await tx.wait();

    return res.json({
      ok: true,
      message: "Payment verified and tokens minted",
      paymentTx,
      mintTx: tx.hash,
      to: toAddress,
      mintedAmount: ethers.formatUnits(mintAmount, 18)
    });
  } catch (err) {
    console.error("❌ Mint error:", err);
    return res.status(400).json({ ok: false, error: String(err.message || err) });
  }
});

// GET untuk cek cepat via browser
router.get("/", (req, res) => {
  res.send(`<h2>✅ Mint endpoint active</h2><p>Use <code>POST /mint</code> from X402Scan (Coinbase Facilitator).</p>`);
});

export default router;
