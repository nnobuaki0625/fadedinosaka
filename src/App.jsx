import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageNotFound from './lib/PageNotFound';

import Landing from './pages/Landing';
import Game from './pages/Game';
import DownloadAssets from './pages/DownloadAssets';
import SecretArchive from './pages/SecretArchive';

const AppRoutes = () => {
return ( <Routes>
<Route path="/" element={<Landing />} />
<Route path="/game" element={<Game />} />
<Route path="/assets" element={<DownloadAssets />} />
<Route path="/secret" element={<SecretArchive />} />
<Route path="*" element={<PageNotFound />} /> </Routes>
);
};

function App() {
return ( <QueryClientProvider client={queryClientInstance}> <Router> <AppRoutes /> </Router> <Toaster /> </QueryClientProvider>
)
}

export default App
