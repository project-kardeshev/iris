import React, { useEffect, useState } from 'react';
import { useBlockchain } from './BlockchainContext';
import './App.css';
import { getDeployedChannels } from './interactions/channelFactory/getDeployedChannels';
import { BrowserProvider } from 'ethers';
import CreateChannelForm from './interactions/components/createChannelForm';
import ChannelContractView from './interactions/components/channelContractView';

function App() {
  const { connectWallet, connectedAddress } = useBlockchain();
  const [deployedChannels, setDeployedChannels] = useState<string[] | null>(null);
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);
  const [selectedChannelAddress, setSelectedChannelAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployedChannels = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const channels = await getDeployedChannels(provider);
        setDeployedChannels(channels);
      } catch (error) {
        console.error('Error fetching deployed channels:', error);
      }
    };

    fetchDeployedChannels();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blockchain Interaction Example</h1>
        {!connectedAddress ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Connected to: {connectedAddress}</p>
        )}
        {selectedChannelAddress ? (
          <ChannelContractView
            channelAddress={selectedChannelAddress}
            onBack={() => setSelectedChannelAddress(null)}
          />
        ) : showCreateChannelForm ? (
          <CreateChannelForm
            connectedAddress={connectedAddress}
            onCreateChannelSuccess={() => setShowCreateChannelForm(false)}
            onCancel={() => setShowCreateChannelForm(false)}
          />
        ) : (
          <div>
            <button onClick={() => setShowCreateChannelForm(true)}>Create Channel Form</button>
            {deployedChannels ? (
              <div>
                <h2>Deployed Channels:</h2>
                <ul>
                  {deployedChannels.map((channel, index) => (
                    <li key={index} onClick={() => setSelectedChannelAddress(channel)}>
                      {channel}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Loading deployed channels...</p>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
