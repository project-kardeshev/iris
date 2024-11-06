import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const leaveComment = async (
  provider: ethers.BrowserProvider,
  videoAddress: string,
  comment: string
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(videoAddress, VideoABI, signer);
    const tx = await contract.leaveComment(comment);
    await tx.wait();
    console.log('Comment left successfully:', tx);
  } catch (error) {
    console.error('Error leaving comment:', error);
    throw error;
  }
};
