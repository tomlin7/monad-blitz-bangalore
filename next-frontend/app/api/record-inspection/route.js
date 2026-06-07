import { NextResponse } from "next/server";
import { ethers } from "ethers";

const REGISTRY_ABI = [
  "function recordInspection(string calldata bookingId, bytes32 reportHash, uint256 repairCost, bool damageFound) external",
  "function inspections(string calldata) external view returns (bytes32 reportHash, uint256 repairCost, bool damageFound, uint256 timestamp, bool exists)"
];

export async function POST(request) {
  try {
    const { bookingId, reportHash, repairCost, damageFound } = await request.json();

    if (!bookingId || !reportHash || repairCost === undefined || damageFound === undefined) {
      return NextResponse.json(
        { error: "Missing bookingId, reportHash, repairCost, or damageFound" },
        { status: 400 }
      );
    }

    const privateKey = process.env.MONAD_PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS;

    if (!privateKey) {
      return NextResponse.json(
        { error: "MONAD_PRIVATE_KEY not configured" },
        { status: 500 }
      );
    }

    if (!contractAddress) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS not configured" },
        { status: 500 }
      );
    }

    // Ensure reportHash is properly formatted as a 32-byte hex string (with 0x prefix)
    let formattedHash = reportHash;
    if (!formattedHash.startsWith("0x")) {
      formattedHash = "0x" + formattedHash;
    }
    if (formattedHash.length !== 66) {
      // If it's not a valid 32-byte hex, we hash it deterministicly using keccak256
      formattedHash = ethers.keccak256(ethers.toUtf8Bytes(reportHash));
    }

    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, REGISTRY_ABI, wallet);

    console.log(`Recording inspection on Monad for booking ${bookingId}...`);

    // Call recordInspection on-chain
    const tx = await contract.recordInspection(bookingId, formattedHash, repairCost, damageFound);
    console.log(`Tx sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Tx confirmed: ${receipt.transactionHash}`);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash || receipt.transactionHash,
      bookingId,
      reportHash: formattedHash,
      repairCost,
      damageFound
    });
  } catch (error) {
    console.error("Error recording inspection on Monad:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record inspection on Monad" },
      { status: 500 }
    );
  }
}
