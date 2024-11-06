import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const getOwner = async (
  provider: ethers.BrowserProvider,
  videoAddress: string
): Promise<string> => {
  try {
    const contract = new ethers.Contract(videoAddress, VideoABI, provider);
    const owner: string = await contract.getOwner();
    console.log('Owner address:', owner);
    return owner;
  } catch (error) {
    console.error('Error getting owner address:', error);
    throw error;
  }
};
