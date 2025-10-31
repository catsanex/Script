export const config = {
  payer: process.env.PAYER,                 // payTo (alamat terima USDC)
  erc20Address: process.env.ERC20_ADDRESS,  // kontrak token dgn mint()
  chainId: "8453",                          // Base mainnet, string agar aman utk validator
  mintPerUsdc: Number(process.env.MINT_PER_USDC || 200),
  usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC Base
  publicBaseUrl: process.env.PUBLIC_BASE_URL?.replace(/\/+$/,"") // hapus trailing slash
};
