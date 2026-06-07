import { NextResponse } from "next/server";
import { ethers } from "ethers";

const REGISTRY_ABI = [
  "function registerDeposit(string calldata bookingId, uint256 depositAmount) external",
  "function deposits(string calldata) external view returns (uint256 amount, uint256 timestamp, bool exists)"
];

export async function POST(request) {
  try {
    const { bookingId, depositAmount } = await request.json();

    if (!bookingId || !depositAmount) {
      return NextResponse.json(
        { error: "Missing bookingId or depositAmount" },
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

    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, REGISTRY_ABI, wallet);

    console.log(`Registering deposit on Monad for booking ${bookingId} with amount ${depositAmount}...`);

    // Call registerDeposit on-chain
    const tx = await contract.registerDeposit(bookingId, depositAmount);
    console.log(`Tx sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Tx confirmed: ${receipt.transactionHash}`);

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash || receipt.transactionHash,
      bookingId,
      depositAmount
    });
  } catch (error) {
    console.error("Error registering deposit on Monad:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register deposit on Monad" },
      { status: 500 }
    );
  }
}
