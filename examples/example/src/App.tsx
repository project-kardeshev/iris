import React, { useEffect, useState } from 'react';
import { useBlockchain } from './BlockchainContext';
import './App.css';
import { getDeployedChannels } from './interactions/channelFactory/getDeployedChannels';
import { BrowserProvider } from 'ethers';
import CreateChannelForm from './interactions/components/createChannelForm';
import GetChannelInfoForm from './interactions/components/getChannelInfoForm';

function App() {
  const { connectWallet, connectedAddress } = useBlockchain();
  const [deployedChannels, setDeployedChannels] = useState<string[] | null>(null);
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);
  const [showGetChannelInfoForm, setShowGetChannelInfoForm] = useState(false);

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
        {showCreateChannelForm ? (
          <CreateChannelForm
            connectedAddress={connectedAddress}
            onCreateChannelSuccess={() => setShowCreateChannelForm(false)}
            onCancel={() => setShowCreateChannelForm(false)}
          />
        ) : showGetChannelInfoForm ? (
          <GetChannelInfoForm />
        ) : (
          <div>
            <button onClick={() => setShowCreateChannelForm(true)}>Create Channel Form</button>
            <button onClick={() => setShowGetChannelInfoForm(true)}>Get Channel Info Form</button>
          </div>
        )}
        {deployedChannels ? (
          <div>
            <h2>Deployed Channels:</h2>
            <ul>
              {deployedChannels.map((channel, index) => (
                <li key={index}>{channel}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading deployed channels...</p>
        )}
      </header>
    </div>
  );
}

export default App;
