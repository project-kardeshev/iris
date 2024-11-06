import { ethers } from 'ethers';
import { VideoABI } from '../constants';

interface TokenInfo {
  videoName: string;
  arweaveTxId: string;
  channelFactory: string;
  videoDescription: string;
  originalCreator: string;
  owner: string;
  createdAt: number;
}

export const getTokenInfo = async (
  provider: ethers.BrowserProvider,
  videoAddress: string
): Promise<TokenInfo> => {
  try {
    const contract = new ethers.Contract(videoAddress, VideoABI, provider);
    const [
      videoName,
      arweaveTxId,
      channelFactory,
      videoDescription,
      originalCreator,
      owner,
      createdAt
    ] = await contract.getTokenInfo();

    const tokenInfo: TokenInfo = {
      videoName,
      arweaveTxId,
      channelFactory,
      videoDescription,
      originalCreator,
      owner,
      createdAt: Number(createdAt)
    };

    console.log('Token Info:', tokenInfo);
    return tokenInfo;
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
};
