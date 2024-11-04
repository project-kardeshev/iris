// src/interactions/components/GetChannelInfoForm.tsx
import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { getChannelInfoByWallet } from '../channelFactory/getChannelInfoByWallet';

const GetChannelInfoForm: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [channelInfo, setChannelInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetChannelInfo = async () => {
    try {
      setError(null); // Reset previous errors
      const provider = new BrowserProvider(window.ethereum);
      const info = await getChannelInfoByWallet(provider, walletAddress);
      setChannelInfo(info);
    } catch (err) {
      console.error('Error getting channel info:', err);
      setError('Failed to retrieve channel info. Please check the wallet address.');
    }
  };

  return (
    <div>
      <h2>Get Channel Info by Wallet Address</h2>
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={handleGetChannelInfo}>Get Info</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {channelInfo && (
        <div>
          <h3>Channel Information:</h3>
          <p>Uploader: {channelInfo.uploader}</p>
          <p>Channel Name: {channelInfo.channelName}</p>
          <p>Channel Description: {channelInfo.channelDescription}</p>
          <p>Channel Address: {channelInfo.channelAddress}</p>
        </div>
      )}
    </div>
  );
};

export default GetChannelInfoForm;
