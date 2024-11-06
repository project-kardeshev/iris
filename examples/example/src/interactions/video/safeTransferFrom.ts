import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const safeTransferFrom = async (
  provider: ethers.BrowserProvider,
  videoAddress: string,
  toAddress: string,
  newChannelAddress: string
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(videoAddress, VideoABI, signer);
    const tx = await contract.safeTransferFrom(toAddress, newChannelAddress);
    await tx.wait();
    console.log('Transfer successful:', tx);
  } catch (error) {
    console.error('Error transferring video:', error);
    throw error;
  }
};