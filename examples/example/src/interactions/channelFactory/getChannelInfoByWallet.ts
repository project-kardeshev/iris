import { ethers } from 'ethers';
import { ChannelFactoryABI, FACTORY_CONTRACT_ADDRESS } from '../constants';

interface ChannelInfo {
  uploader: string;
  channelName: string;
  channelDescription: string;
  channelAddress: string;
}

export const getChannelInfoByWallet = async (
  provider: ethers.BrowserProvider,
  uploaderAddress: string
): Promise<ChannelInfo> => {
  try {
    const contract = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, ChannelFactoryABI, provider);
    const channelInfo: ChannelInfo = await contract.getChannelInfoByWallet(uploaderAddress);
    console.log('Channel info:', channelInfo);
    return channelInfo;
  } catch (error) {
    console.error('Error getting channel info by wallet:', error);
    throw error;
  }
};
