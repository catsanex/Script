export const config = {
  // alamat yang menerima pembayaran 5 USDC
  payer: process.env.PAYER,

  // kontrak token ERC20 milikmu yang punya mint(address,uint256)
  erc20Address: process.env.ERC20_ADDRESS,

  // chain Base
  chainId: "8453", // string agar aman untuk validator x402

  // rasio mint (1 USDC → MINT_PER_USDC token)
  mintPerUsdc: Number(process.env.MINT_PER_USDC || 200),

  // konstanta USDC Base mainnet
  usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
};
