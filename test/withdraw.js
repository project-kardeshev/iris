const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider('https://testnet-rpc.wvm.dev');
const contractAddress = '0x998cF8C07E2AFCc6eA5E7348cf3706F5be3c98E1';
const privateKey = process.env.PRIVATE_KEY;

const channelAbi = [
  "function withdraw() public"
];

async function withdrawFunds() {
  const wallet = new ethers.Wallet(privateKey, provider);
  const channelContract = new ethers.Contract(contractAddress, channelAbi, wallet);

  try {
    const tx = await channelContract.withdraw();
    await tx.wait();
    console.log('Funds withdrawn successfully:', tx);
  } catch (error) {
    console.error('Error withdrawing funds:', error);
  }
}

withdrawFunds();
