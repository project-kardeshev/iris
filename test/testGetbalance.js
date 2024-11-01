// import { JsonRpcProvider, formatEther } from "ethers"; // Ethers version 6
const {JsonRpcProvider, formatEther} = require("ethers")

const provider = new JsonRpcProvider("https://testnet-rpc.wvm.dev");

const address = "0x6B324A1F65DEcd2aD945BAA84cA75F018Be8Cec3";

async function getBalance() {
    try {
        const balance = await provider.getBalance(address);
        console.log(`Balance: ${formatEther(balance)} tWVM`);
    } catch (error) {
        console.error(`Error getting balance: ${error.message}`);
    }
}

getBalance();
