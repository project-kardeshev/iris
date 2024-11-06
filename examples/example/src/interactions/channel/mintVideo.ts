import { ethers } from 'ethers';
import { ChannelABI } from '../constants';

export const mintVideo = async (
  provider: ethers.BrowserProvider,
  channelAddress: string,
  arweaveTxId: string,
  videoName: string,
  videoDescription: string
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(channelAddress, ChannelABI, signer);
    const tx = await contract.mintVideo(arweaveTxId, videoName, videoDescription);
    await tx.wait();
    console.log('Video minted successfully:', tx);
  } catch (error) {
    console.error('Error minting video:', error);
    throw error;
  }
};
