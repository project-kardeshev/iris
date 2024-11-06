import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const likeVideo = async (
  provider: ethers.BrowserProvider,
  videoAddress: string
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(videoAddress, VideoABI, signer);
    const tx = await contract.like();
    await tx.wait();
    console.log('Video liked successfully:', tx);
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};
