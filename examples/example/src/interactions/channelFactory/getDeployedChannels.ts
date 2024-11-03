
import { ethers } from 'ethers';
import { ChannelFactoryABI, FACTORY_CONTRACT_ADDRESS } from '../constants';

export const getDeployedChannels = async (
  provider: ethers.BrowserProvider
): Promise<string[]> => {
  try {
    const contract = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, ChannelFactoryABI, provider);
    const channels: string[] = await contract.getDeployedChannels();
    console.log('Deployed channels:', channels);
    return channels;
  } catch (error) {
    console.error('Error getting deployed channels:', error);
    throw error;
  }
};
