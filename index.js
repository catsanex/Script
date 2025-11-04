import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servers = [
  { name: "Mint", file: "server-mint.js" },
  { name: "Mint1", file: "server-mint1.js" },
  { name: "Mint10", file: "server-mint10.js" },
  { name: "Minted", file: "server-minted.js" },
];

servers.forEach(({ name, file }) => {
  const server = spawn("node", [path.join(__dirname, file)], { stdio: "inherit" });
  server.on("exit", code => console.log(`❌ ${name} exited: ${code}`));
});

console.log(`
🚀 All Catsanex Mint servers launched:
- /mint (port 4021)
- /mint-1nft (port 4022)
- /mint-10nft (port 4023)
- /minted-percent (port 4024)
`);
