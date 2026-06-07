const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const envPath = path.resolve(__dirname, '../.env.local');

if (!fs.existsSync(envPath)) {
  const wallet = ethers.Wallet.createRandom();
  const envContent = `# Monad configuration
MONAD_PRIVATE_KEY=${wallet.privateKey}
# Monad Wallet Address: ${wallet.address}

# Gemini API configuration
GEMINI_API_KEY=

# Sarvam API configuration
SARVAM_API_KEY=
`;
  fs.writeFileSync(envPath, envContent);
  console.log(`Generated .env.local with a new wallet: ${wallet.address}`);
} else {
  console.log(`.env.local already exists`);
}
