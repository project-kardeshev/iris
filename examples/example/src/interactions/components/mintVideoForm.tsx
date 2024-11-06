// src/interactions/components/MintVideoComponent.tsx
import React, { useState } from 'react';
import { mintVideo } from '../channel/mintVideo';
import { BrowserProvider } from 'ethers';

interface MintVideoComponentProps {
  channelAddress: string;
}

const MintVideoComponent: React.FC<MintVideoComponentProps> = ({ channelAddress }) => {
  const [arweaveTxId, setArweaveTxId] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [minting, setMinting] = useState<boolean>(false);

  const handleMint = async () => {
    if (!arweaveTxId.trim()) {
      alert('Please enter a valid Arweave transaction ID.');
      return;
    }
    setMinting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
     

      // Call mintVideo function
      await mintVideo(provider, channelAddress, arweaveTxId, videoName, videoDescription);

      alert('Video minted successfully!');
    } catch (error) {
      console.error('Error minting video:', error);
      alert('An error occurred while minting the video.');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <h2>Mint Video</h2>
      <input
        type="text"
        placeholder="Arweave Transaction ID"
        value={arweaveTxId}
        onChange={(e) => setArweaveTxId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Video Name"
        value={videoName}
        onChange={(e) => setVideoName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Video Description"
        value={videoDescription}
        onChange={(e) => setVideoDescription(e.target.value)}
      />
      <button onClick={handleMint} disabled={minting}>
        {minting ? 'Minting...' : 'Mint Video'}
      </button>
    </div>
  );
};

export default MintVideoComponent;
