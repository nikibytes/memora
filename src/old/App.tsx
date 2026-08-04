import React, { useState, useEffect } from 'react';
import './styles/theme.css';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);

  // Listen for PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredInstallPrompt(null);
      });
    } else {
      alert('PWA App Ready! On Mobile Safari/Chrome tap "Add to Home Screen" or click Chrome installation button in address bar.');
    }
  };

  const handleLoginSuccess = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    setCurrentView('dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* PWA installation top banner */}
      <PwaInstallBanner
        onInstall={handleInstallPwa}
        canInstall={true}
      />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLoggedIn={isLoggedIn}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Page View Switcher */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage
            onStartDemo={() => {
              if (!isLoggedIn) {
                setIsLoggedIn(true);
                setUsername('@alex.creatives');
              }
              setCurrentView('dashboard');
            }}
            onLoginClick={() => setCurrentView('login')}
          />
        )}

        {currentView === 'login' && (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage username={username || '@alex.creatives'} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
