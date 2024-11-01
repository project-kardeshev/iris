const { ethers } = require("ethers");
require("dotenv").config();

// Connect to the blockchain
const provider = new ethers.JsonRpcProvider("https://testnet-rpc.wvm.dev");

// ChannelFactory contract address
const contractAddress = "0x94b71ddE13f547e7c1b63AEcBE01FB588E4683a0";

// ChannelFactory ABI
const abi = [
  "function createChannelContract(string userName, string channelDescription, string logo) public",
  "function getDeployedChannels() public view returns (address[] memory)"
];

// Wallet to interact with the contract
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create a contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Create a new channel
async function createChannel() {
  try {
    const tx = await contract.createChannelContract("MyChannel", "This is my channel description", "");
    console.log("Creating channel...", tx.hash);

    // Wait for transaction confirmation
    await tx.wait();
    console.log("Channel created successfully.");
  } catch (error) {
    console.error("Error creating channel:", error);
  }
}

// Get deployed channels
async function getDeployedChannels() {
  try {
    const channels = await contract.getDeployedChannels();
    console.log("Deployed channels:", channels);
  } catch (error) {
    console.error("Error getting deployed channels:", error);
  }
}

// Run the functions
(async () => {
  await createChannel();
  await getDeployedChannels();
})();
