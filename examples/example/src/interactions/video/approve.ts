import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const approveVideo = async (
  provider: ethers.BrowserProvider,
  videoAddress: string,
  approvedAddress: string
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(videoAddress, VideoABI, signer);
    const tx = await contract.approve(approvedAddress);
    await tx.wait();
    console.log('Approval successful:', tx);
  } catch (error) {
    console.error('Error approving video:', error);
    throw error;
  }
};
