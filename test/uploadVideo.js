const fs = require('fs');
const { ethers } = require('ethers');
require('dotenv').config();

// const CONTRACT_ADDRESS = "0x90b3300711B59390D9BE825F5385C81BBc9D1367";
const CONTRACT_ADDRESS = "0x02fA15909055a0f424ADd3bbf1640be02dff83Fd"
const CONTRACT_ABI = [
  "function uploadVideo(bytes videoData) public returns (string)",
  "function getLogs() public returns (string[] memory)"
];

const provider = new ethers.JsonRpcProvider("https://testnet-rpc.wvm.dev");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

async function uploadVideo(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read video file and convert it to a byte array
    const videoData = fs.readFileSync(filePath);
    const videoBytes = Uint8Array.from(videoData);

    // Upload video to the contract
    console.log("Uploading video to the blockchain...");
    const tx = await contract.uploadVideo(videoBytes, {
      gasLimit: 5000000 // Adjust as needed
    });

    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);

    // Log receipt to a dedicated file
    fs.appendFileSync('receipt_log.txt', `${new Date().toISOString()} - Receipt: ${JSON.stringify(receipt, null, 2)}\n`);
  } catch (error) {
    console.error("Error uploading video:", error.message);
    fs.appendFileSync('error_log.txt', `${new Date().toISOString()} - Error: ${error.stack}\n`);
  }
}

async function getLogs(){
    const logs = await contract.getLogs()

    console.log(logs)
}

// Example usage
const path = require('path');
const filePath = path.resolve(process.env.HOME, 'Pictures/fifth-of-jack.gif');

// uploadVideo(filePath);
getLogs()
