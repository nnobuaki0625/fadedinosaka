import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Landing from './pages/Landing';
import Game from './pages/Game';
import DownloadAssets from './pages/DownloadAssets';
import SecretArchive from './pages/SecretArchive';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-silver/20 border-t-crimson rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-silver/30 tracking-[0.4em]">LOADING SIGNAL...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/game" element={<Game />} />
      <Route path="/assets" element={<DownloadAssets />} />
      <Route path="/secret" element={<SecretArchive />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
