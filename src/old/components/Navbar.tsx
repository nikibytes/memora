import React from 'react';
import { Download, Sparkles, LogIn, User, LayoutGrid, Home, Smartphone } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'login' | 'dashboard';
  setCurrentView: (view: 'landing' | 'login' | 'dashboard') => void;
  isLoggedIn: boolean;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isLoggedIn,
  onInstallPwa,
  canInstallPwa = true
}) => {
  return (
    <nav className="glass-panel" style={{
      margin: '16px auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1280px',
      position: 'sticky',
      top: '16px',
      zIndex: 90
    }}>
      {/* Brand logo & name */}
      <div 
        onClick={() => setCurrentView('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
      >
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(138, 80, 229, 0.2), rgba(168, 85, 247, 0.4))',
          border: '1px solid rgba(138, 80, 229, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(138, 80, 229, 0.3)'
        }}>
          <img src="/app/assets/logo.svg" alt="Memora Logo" style={{ width: '32px', height: '32px' }} />
        </div>
        <div>
          <h2 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.35rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFFFFF 30%, #D3AAF1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            lineHeight: 1.2
          }}>
            Memora
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'block' }}>
            AI Search for Instagram Saves
          </span>
        </div>
      </div>

      {/* Center View Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '4px 6px',
        borderRadius: '999px',
        border: '1px solid var(--border)'
      }}>
        <button
          onClick={() => setCurrentView('landing')}
          style={{
            background: currentView === 'landing' ? 'var(--primary)' : 'transparent',
            color: currentView === 'landing' ? '#FFF' : 'var(--muted-foreground)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Home size={15} /> Landing
        </button>

        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            background: currentView === 'dashboard' ? 'var(--primary)' : 'transparent',
            color: currentView === 'dashboard' ? '#FFF' : 'var(--muted-foreground)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <LayoutGrid size={15} /> Dashboard
        </button>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {canInstallPwa && (
          <button 
            onClick={onInstallPwa}
            className="btn-secondary"
            title="Install Mobile & Desktop PWA App"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <Smartphone size={15} color="#A855F7" />
            <span>Install PWA</span>
          </button>
        )}

        {isLoggedIn ? (
          <button
            onClick={() => setCurrentView('dashboard')}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <User size={16} />
            <span>@alex.creatives</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('login')}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <LogIn size={16} />
            <span>Connect Instagram</span>
          </button>
        )}
      </div>
    </nav>
  );
};
