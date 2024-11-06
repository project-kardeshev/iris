import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const getLikeNumber = async (
  provider: ethers.BrowserProvider,
  videoAddress: string
): Promise<number> => {
  try {
    const contract = new ethers.Contract(videoAddress, VideoABI, provider);
    const likeNumber: number = await contract.getLikeNumber();
    console.log('Number of likes:', likeNumber);
    return likeNumber;
  } catch (error) {
    console.error('Error getting number of likes:', error);
    throw error;
  }
};