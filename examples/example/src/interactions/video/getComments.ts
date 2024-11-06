import { ethers } from 'ethers';
import { VideoABI } from '../constants';

interface Comment {
  timestamp: number;
  commenter: string;
  comment: string;
}

export const getComments = async (
  provider: ethers.BrowserProvider,
  videoAddress: string
): Promise<Comment[]> => {
  try {
    const contract = new ethers.Contract(videoAddress, VideoABI, provider);
    const comments: Comment[] = await contract.getComments();
    console.log('Comments:', comments);
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};
