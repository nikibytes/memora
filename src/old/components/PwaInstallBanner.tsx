import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, WifiOff } from 'lucide-react';

interface PwaInstallBannerProps {
  onInstall: () => void;
  canInstall: boolean;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onInstall, canInstall }) => {
  const [dismissed, setDismissed] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div style={{
        background: '#EF4444',
        color: '#FFF',
        padding: '10px 20px',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '0.88rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <WifiOff size={16} />
        <span>Offline Mode Activated — Displaying cached Instagram collections</span>
      </div>
    );
  }

  if (!canInstall || dismissed) return null;

  return (
    <div className="pwa-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Smartphone size={18} />
        <span>Install <strong>Memora PWA App</strong> for fast offline access and native mobile search.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onInstall}
          style={{
            background: '#FFFFFF',
            color: '#8A50E5',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Download size={14} /> Install PWA App
        </button>

        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
