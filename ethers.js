import { ethers } from "ethers";

const rpc = process.env.RPC_URL || "https://mainnet.base.org";

export const provider = new ethers.JsonRpcProvider(rpc);

// PRIVATE_KEY HARUS terisi. Address ini yang memanggil token.mint()
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.length < 66) {
  console.error("❌ PRIVATE_KEY tidak valid / belum diisi");
  process.exit(1);
}
export const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
