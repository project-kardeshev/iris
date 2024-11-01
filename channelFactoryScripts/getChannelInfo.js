const { ethers } = require("ethers");
require("dotenv").config();

// Connect to the blockchain
const provider = new ethers.JsonRpcProvider("https://testnet-rpc.wvm.dev");

// Channel contract address
const channelAddress = "0xb2B8A0d7B0a28dA191E3b1a5C3BD81f9A54E5cad";

// Channel ABI
const channelAbi = [
  "function getChannelInfo() public view returns (address, string memory, string memory, string memory)"
];

// Wallet to interact with the contract
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create a contract instance
const channelContract = new ethers.Contract(channelAddress, channelAbi, wallet);

// Get channel information
async function getChannelInfo() {
  try {
    const channelInfo = await channelContract.getChannelInfo();
    console.log("Channel Information:", {
      uploader: channelInfo[0],
      userName: channelInfo[1],
      channelDescription: channelInfo[2],
      logo: channelInfo[3],
    });
  } catch (error) {
    console.error("Error getting channel information:", error);
  }
}

// Run the function
getChannelInfo();
