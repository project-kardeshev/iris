const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider('https://testnet-rpc.wvm.dev');
const contractAddress = 'YOUR_CHANNEL_CONTRACT_ADDRESS';
const privateKey = process.env.PRIVATE_KEY;

const channelAbi = [
  "function updateChannel(string _channelName, string _channelDescription, string _logo) public"
];

async function updateChannelInfo(newName, newDescription, newLogo) {
  const wallet = new ethers.Wallet(privateKey, provider);
  const channelContract = new ethers.Contract(contractAddress, channelAbi, wallet);
  
  try {
    const tx = await channelContract.updateChannel(newName, newDescription, newLogo);
    await tx.wait();
    console.log('Channel information updated successfully:', tx);
  } catch (error) {
    console.error('Error updating channel information:', error);
    if (error.reason) {
      console.error('Revert reason:', error.reason);
    }
  }
}

updateChannelInfo('New Channel Name', 'Updated channel description', 'NewLogoUrlOrTxId');
