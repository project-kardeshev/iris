// src/interactions/components/VideoComponent.tsx
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { BrowserProvider } from 'ethers';
import { getVideo } from '../video/getVideo';
import { getComments } from '../video/getComments';
import { getLikeNumber } from '../video/getLikeNumber';
import { likeVideo } from '../video/like';
import { leaveComment } from '../video/leaveComment';

interface VideoComponentProps {
  videoAddress: string;
  onBack: () => void;
}

interface Comment {
  timestamp: bigint;
  commenter: string;
  comment: string;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ videoAddress, onBack }) => {
  const [videoData, setVideoData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'image' | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [likeNumber, setLikeNumber] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const videoBytes = await getVideo(provider, videoAddress);
        const base64Data = Buffer.from(videoBytes.startsWith('0x') ? videoBytes.slice(2) : videoBytes, 'hex').toString('base64');
        setVideoData(base64Data);

        // Determine media type by inspecting the first few bytes
        if (base64Data.startsWith('UklGR')) {
          setMediaType('audio'); // WAV audio file signature
        } else if (base64Data.startsWith('/9j/')) {
          setMediaType('image'); // JPEG image file signature
        } else {
          setMediaType('video'); // Assume it's a video if not recognized as audio or image
        }

        const videoComments = await getComments(provider, videoAddress);
        // @ts-expect-error idk why this doesnt wanna comply, it works
        setComments(videoComments);

        const likes = await getLikeNumber(provider, videoAddress);
        setLikeNumber(Number(likes));
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [videoAddress]);

  const handleLike = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      await likeVideo(provider, videoAddress);
      setLikeNumber((prev) => (prev !== null ? prev + 1 : 1));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleComment = async () => {
    try {
      if (newComment.trim() === '') return;
      const provider = new BrowserProvider(window.ethereum);
      await leaveComment(provider, videoAddress, newComment);
      setComments((prev) =>
        prev ? [{ timestamp: BigInt(Date.now()), commenter: 'You', comment: newComment }, ...prev] : []
      );
      setNewComment('');
    } catch (error) {
      console.error('Error leaving comment:', error);
    }
  };

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h2>Video</h2>
      {videoData ? (
        mediaType === 'video' ? (
          <video controls>
            <source src={`data:video/mp4;base64,${videoData}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : mediaType === 'audio' ? (
          <audio controls>
            <source src={`data:audio/wav;base64,${videoData}`} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        ) : mediaType === 'image' ? (
          <img src={`data:image/jpeg;base64,${videoData}`} alt="Media/Thumbnail" style={{ maxWidth: '100%' }} />
        ) : null
      ) : (
        <p>Loading media...</p>
      )}
      <div>
        <h3>Likes: {likeNumber}</h3>
        <button onClick={handleLike}>Like</button>
      </div>
      <div>
        <h3>Comments</h3>
        <input
          type="text"
          placeholder="Leave a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleComment}>Comment</button>
        <ul>
          {comments && comments.length > 0 && Array.isArray(comments) ? (
            comments.map((comment, index) => (
              <li key={index}>
                <p>
                  <strong>{comment.commenter}</strong>: {comment.comment}
                </p>
                <p style={{ fontSize: '0.8em' }}>Timestamp: {new Date(Number(comment.timestamp) * 1000 ).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VideoComponent;
