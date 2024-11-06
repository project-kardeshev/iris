import { ethers } from 'ethers';
import { ChannelABI } from '../constants';

export const withdraw = async (
  provider: ethers.BrowserProvider,
  channelAddress: string
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(channelAddress, ChannelABI, signer);
    const tx = await contract.withdraw();
    await tx.wait();
    console.log('Withdrawal successful:', tx);
  } catch (error) {
    console.error('Error withdrawing funds:', error);
    throw error;
  }
};
