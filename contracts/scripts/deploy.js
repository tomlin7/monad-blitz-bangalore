const hre = require("hardhat");

async function main() {
  console.log("Deploying EscrowInspectionRegistry...");
  
  const EscrowInspectionRegistry = await hre.ethers.getContractFactory("EscrowInspectionRegistry");
  const contract = await EscrowInspectionRegistry.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("EscrowInspectionRegistry deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
