import { ethers } from 'ethers';
import { ChannelABI } from '../constants';

interface ChannelInfo {
  uploader: string;
  channelName: string;
  channelDescription: string;
  logo: string;
  channelFactory: string;
  videoContracts: string[];
}

export const getChannelInfo = async (
  provider: ethers.BrowserProvider,
  channelAddress: string
): Promise<ChannelInfo> => {
  try {
    const contract = new ethers.Contract(channelAddress, ChannelABI, provider);
    const [
      uploader,
      channelName,
      channelDescription,
      logo,
      channelFactory,
      videoContracts
    ] = await contract.getChannelInfo();

    const channelInfo: ChannelInfo = {
      uploader,
      channelName,
      channelDescription,
      logo,
      channelFactory,
      videoContracts
    };

    console.log('Channel Info:', channelInfo);
    return channelInfo;
  } catch (error) {
    console.error('Error getting channel info:', error);
    throw error;
  }
};
