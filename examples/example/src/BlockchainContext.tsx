import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';


declare global {
  interface Window {
    ethereum?: any;
  }
}
interface BlockchainContextProps {
  connectWallet: () => Promise<void>;
  connectedAddress: string | null;
}

const BlockchainContext = createContext<BlockchainContextProps | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      // Listen for accounts changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          console.log('MetaMask is locked or the user has not connected any accounts');
          setConnectedAddress(null);
        } else {
          console.log('Accounts changed:', accounts);
          setConnectedAddress(accounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it to use this feature.');
        return;
      }

      console.log('Requesting MetaMask accounts...');
      
      // Request accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        console.error('No accounts found or user denied account access.');
        alert('Please connect at least one account in MetaMask.');
        return;
      }

      console.log('Accounts retrieved:', accounts);

      // Create an instance of a provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log('Provider and signer created:', provider, signer);
      
      setConnectedAddress(await signer.getAddress());
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected request
        console.error('User rejected the connection request');
        alert('You need to connect MetaMask to use this feature.');
      } else {
        console.error('Unexpected error connecting to MetaMask:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <BlockchainContext.Provider value={{ connectWallet, connectedAddress }}>
      {children}
    </BlockchainContext.Provider>
  );
};
