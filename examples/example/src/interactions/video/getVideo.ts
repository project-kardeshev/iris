import { ethers } from 'ethers';
import { VideoABI } from '../constants';

export const getVideo = async (
  provider: ethers.BrowserProvider,
  videoAddress: string
): Promise<string> => {
  try {
    const contract = new ethers.Contract(videoAddress, VideoABI, provider);
    const videoBytes: string = await contract.getVideo();
    console.log('Video Bytes:', videoBytes);
    return videoBytes;
  } catch (error) {
    console.error('Error getting video:', error);
    throw error;
  }
};
