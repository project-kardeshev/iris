import React, { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { getChannelInfo } from '../channel/getChannelInfo';
import { getTokenInfo } from '../video/getTokenInfo';
import VideoComponent from './videoComponent';
import MintVideoComponent from './mintVideoForm';

interface ChannelContractViewProps {
  channelAddress: string;
  onBack: () => void;
}

interface ChannelInfo {
  uploader: string;
  channelName: string;
  channelDescription: string;
  logo: string;
  channelFactory: string;
  videoContracts: string[];
}

interface VideoInfo {
  videoName: string;
  videoDescription: string;
  videoAddress: string;
}

const ChannelContractView: React.FC<ChannelContractViewProps> = ({ channelAddress, onBack }) => {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [videoInfos, setVideoInfos] = useState<VideoInfo[] | null>(null);
  const [selectedVideoAddress, setSelectedVideoAddress] = useState<string | null>(null);
  const [showMintVideoForm, setShowMintVideoForm] = useState<boolean>(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        setConnectedAddress(accounts[0]?.address || null);

        const info = await getChannelInfo(provider, channelAddress);
        setChannelInfo(info);

        // Fetch video info for each video contract
        const videoInfoPromises = info.videoContracts.map((videoContract) =>
          getTokenInfo(provider, videoContract)
        );
        const videos = await Promise.all(videoInfoPromises);
        const formattedVideoInfos = videos.map((video, index) => ({
          videoName: video.videoName,
          videoDescription: video.videoDescription,
          videoAddress: info.videoContracts[index],
        }));
        setVideoInfos(formattedVideoInfos);
      } catch (error) {
        console.error('Error fetching channel or video info:', error);
      }
    };

    fetchChannelInfo();
  }, [channelAddress]);

  return (
    <div>
      <button onClick={onBack}>Back</button>
      {selectedVideoAddress ? (
        <VideoComponent videoAddress={selectedVideoAddress} onBack={() => setSelectedVideoAddress(null)} />
      ) : showMintVideoForm && channelInfo ? (
        <MintVideoComponent
          channelAddress={channelAddress}
        />
      ) : channelInfo ? (
        <div>
          <h2>Channel Info</h2>
          <p>Uploader: {channelInfo.uploader}</p>
          <p>Channel Name: {channelInfo.channelName}</p>
          <p>Channel Description: {channelInfo.channelDescription}</p>
          {channelInfo.logo && <img src={channelInfo.logo} alt="Channel Logo" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
          <p>Channel Factory: {channelInfo.channelFactory}</p>
          {connectedAddress === channelInfo.uploader && (
            <button onClick={() => setShowMintVideoForm(true)}>Mint Video</button>
          )}
          <h3>Videos:</h3>
          <ul>
            {videoInfos && videoInfos.length > 0 ? (
              videoInfos.map((video, index) => (
                <li key={index}>
                  <button onClick={() => setSelectedVideoAddress(video.videoAddress)}>
                    <h4>{video.videoName}</h4>
                    <p>{video.videoDescription}</p>
                  </button>
                </li>
              ))
            ) : (
              <p>Loading video info...</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading channel info...</p>
      )}
    </div>
  );
};

export default ChannelContractView;
