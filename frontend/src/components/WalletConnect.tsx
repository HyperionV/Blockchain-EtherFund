import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { formatAddress } from '../utils/ethers';

export function WalletConnect() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWeb3();
  const [showMenu, setShowMenu] = useState(false);

  const handleSwitchAccount = async () => {
    setShowMenu(false);
    try {
      // Disconnect and revoke permissions
      await disconnect();
      // Wait a bit for disconnect to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      // Force account selection by passing true
      await connect(true);
    } catch (error: any) {
      console.log('Switch account cancelled or failed:', error.message);
    }
  };

  const handleConnect = async () => {
    try {
      // If user was disconnected, force account selection
      // This ensures they can choose a different account
      await connect(true);
    } catch (error: any) {
      // User rejected or error - don't show error, just let them try again
      console.log('Connection cancelled or failed:', error.message);
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="text-sm text-gray-300">{formatAddress(address)}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {showMenu && (
          <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-[200px] z-50">
            <button
              onClick={handleSwitchAccount}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg transition-colors"
            >
              Switch Account
            </button>
            <button
              onClick={async () => {
                await disconnect();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400 rounded-b-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Click outside to close menu */}
        {showMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
      aria-label="Connect MetaMask wallet"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

