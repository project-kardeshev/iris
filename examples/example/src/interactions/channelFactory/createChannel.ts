import { ethers } from 'ethers';
import { ChannelFactoryABI, FACTORY_CONTRACT_ADDRESS } from '../constants';

export const createChannelContract = async (
  provider: ethers.BrowserProvider,
  channelName: string,
  channelDescription: string,
  logo: string
) => {
  try {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, ChannelFactoryABI, signer);
    const tx = await contract.createChannelContract(channelName, channelDescription, logo);
    await tx.wait();
    console.log('Channel created successfully:', tx);
    return tx;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};
