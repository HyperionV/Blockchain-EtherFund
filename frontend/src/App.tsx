import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from './contexts/Web3Context';
import { WalletConnect } from './components/WalletConnect';
import { CampaignList } from './components/CampaignList';
import { CampaignDetail } from './components/CampaignDetail';
import { CreateCampaign } from './components/CreateCampaign';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 text-white">
            <header className="border-b border-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                  <Link to="/" className="text-2xl font-bold">
                    EtherFund
                  </Link>
                  <nav className="flex items-center gap-6">
                    <Link
                      to="/"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Campaigns
                    </Link>
                    <Link
                      to="/create"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Create
                    </Link>
                    <WalletConnect />
                  </nav>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/campaign/:id" element={<CampaignDetail />} />
                <Route path="/create" element={<CreateCampaign />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;

