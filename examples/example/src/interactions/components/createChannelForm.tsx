// src/interactions/components/createChannelForm.tsx
import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { createChannelContract } from '../channelFactory/createChannel';

interface CreateChannelFormProps {
  connectedAddress: string | null;
  onCreateChannelSuccess: () => void;
  onCancel: () => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ connectedAddress, onCreateChannelSuccess, onCancel }) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [logo, setLogo] = useState('');

  const handleCreateChannel = async () => {
    try {
      if (!connectedAddress) {
        alert('Please connect your wallet first.');
        return;
      }
      const provider = new BrowserProvider(window.ethereum);
      const tx = await createChannelContract(provider,channelName, channelDescription, logo);
      console.log('Channel created successfully:', tx);
      onCreateChannelSuccess();
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  return (
    <div>
      <h2>Create Channel</h2>
      <input
        type="text"
        placeholder="Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Channel Description"
        value={channelDescription}
        onChange={(e) => setChannelDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Logo URL"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
      />
      <button onClick={handleCreateChannel}>Create Channel</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CreateChannelForm;
