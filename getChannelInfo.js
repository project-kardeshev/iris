const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider('https://testnet-rpc.wvm.dev');
const contractAddress = '0x2F5B40690A42f161b6BA9d32F60e55020AB14573';
const walletAddress = '0xba8172DcaB4A44DcE5B7bFc00236188697fe805d';

const channelFactoryAbi = [
  "function getChannelInfoByWallet(address _uploader) public view returns (tuple(address uploader, string channelName, string channelDescription, address channelAddress))"
];

async function getChannelInfo() {
  const factoryContract = new ethers.Contract(contractAddress, channelFactoryAbi, provider);
  try {
    const channelInfo = await factoryContract.getChannelInfoByWallet(walletAddress);
    console.log(`Channel info for ${walletAddress}:`, channelInfo);
  } catch (error) {
    console.error('Error fetching channel info:', error);
  }
}

getChannelInfo();
