const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider('https://testnet-rpc.wvm.dev');
const contractAddress = '0x998cF8C07E2AFCc6eA5E7348cf3706F5be3c98E1';
const privateKey = process.env.SECOND_PRIVATE_KEY;

const channelAbi = [
  "function tipChannel() public payable"
];

async function tipChannel() {
  const wallet = new ethers.Wallet(privateKey, provider);
  const channelContract = new ethers.Contract(contractAddress, channelAbi, wallet);

  try {
    const tx = await channelContract.tipChannel({
      value: ethers.parseEther('0.005') // Convert 0.005 ETH to Wei
    });
    await tx.wait();
    console.log('Tip successful:', tx);
  } catch (error) {
    console.error('Error tipping:', error);
    if (error.reason) {
      console.error('Revert reason:', error.reason);
    }
  }
}

tipChannel();
