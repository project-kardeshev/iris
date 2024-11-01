// Import ethers components and dotenv
require('dotenv').config();
const { JsonRpcProvider, Wallet, Contract } = require("ethers");

// Set up provider and contract details
const provider = new JsonRpcProvider("https://testnet-rpc.wvm.dev");

const contractAddress = "0xfCde41557E89eE62dEd219BA36EBFAaD6C92A213";
const contractABI = [
  "function getGreeting() public view returns (string)",
  "function setGreeting(string memory _greeting) public",
  "function getArweave(string memory txid) public view returns (bytes)"
];

// Replace with your private key (ensure this key is not shared)
const privateKey = process.env.PRIVATE_KEY;
const signer = new Wallet(privateKey, provider);

// Create a contract instance
const myContract = new Contract(contractAddress, contractABI, signer);

// Function to get the greeting from the contract
async function getGreeting() {
  try {
    const greeting = await myContract.getGreeting();
    console.log(`Greeting: ${greeting}`);
  } catch (error) {
    console.error(`Error getting greeting: ${error.message}`);
  }
}

// Function to set the greeting in the contract
async function setGreeting(newGreeting) {
  try {
    const tx = await myContract.setGreeting(newGreeting);
    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait();
    console.log(`Greeting updated to: ${newGreeting}`);
  } catch (error) {
    console.error(`Error setting greeting: ${error.message}`);
  }
}

// Function to get Arweave data by passing in a txid
async function getArweave(txid) {
  try {
    const result = await myContract.getArweave(txid);
    const decodedResult = Buffer.from(result.slice(2), 'hex').toString();
    console.log(`Arweave data: ${decodedResult}`);
  } catch (error) {
    console.error(`Error getting Arweave data: ${error.message}`);
  }
}

// Example usage
// getGreeting();
// Uncomment the next line to set a new greeting
// setGreeting("permanent inappropriate message: fuck");
// Uncomment the next line to get Arweave data
getArweave("n4SbdcHjGCwU1anlbm7zW0F1lCSOw6jNyi6hoS5nrb0");
