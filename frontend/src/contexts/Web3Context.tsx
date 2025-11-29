import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getProvider, getNetwork } from '../services/blockchain';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: bigint | null;
  connect: (forceAccountSelection?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [hasDisconnected, setHasDisconnected] = useState(false);

  const connect = useCallback(async (forceAccountSelection: boolean = false) => {
    try {
      setIsConnecting(true);
      setHasDisconnected(false); // Reset disconnect flag when user explicitly connects
      const provider = await connectWallet(forceAccountSelection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setChainId(network.chainId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setHasDisconnected(true); // Mark as explicitly disconnected
    
    // Revoke MetaMask permissions so next connection shows account selection
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      } catch (error) {
        // Ignore errors - permissions might not exist
        console.log('Revoke permissions on disconnect:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Only auto-connect if user hasn't explicitly disconnected
    const checkConnection = async () => {
      if (hasDisconnected) {
        return; // Don't auto-connect if user explicitly disconnected
      }

      const provider = getProvider();
      if (provider) {
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            setProvider(provider);
            setSigner(signer);
            setAddress(address);
            setChainId(network.chainId);
          }
        } catch (error) {
          console.error('Failed to check connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          await disconnect();
        } else if (!hasDisconnected) {
          // Only auto-connect if user hasn't explicitly disconnected
          await connect();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [connect, disconnect, hasDisconnected]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        isConnected: !!address,
        isConnecting,
        chainId,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

