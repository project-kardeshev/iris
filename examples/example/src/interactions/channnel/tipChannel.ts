import { ethers } from 'ethers';
import { ChannelABI } from '../constants';

export const tipChannel = async (
  provider: ethers.BrowserProvider,
  channelAddress: string,
  amount: ethers.BigNumberish
): Promise<void> => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(channelAddress, ChannelABI, signer);
    const tx = await contract.tipChannel({ value: amount });
    await tx.wait();
    console.log('Tip sent successfully:', tx);
  } catch (error) {
    console.error('Error tipping channel:', error);
    throw error;
  }
};
