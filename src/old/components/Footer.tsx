import React from 'react';
import { ExternalLink, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 20px 30px',
      marginTop: 'auto',
      background: 'rgba(13, 15, 23, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        fontSize: '0.88rem',
        color: 'var(--muted-foreground)'
      }}>
        {/* Left branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/app/assets/logo.svg" alt="Logo" style={{ width: '28px', height: '28px' }} />
          <span style={{ color: '#FFF', fontWeight: 700 }}>Memora PWA</span>
          <span>© 2026 Memora Inc. All rights reserved.</span>
        </div>

        {/* Center Theme Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem' }}>Styled with theme:</span>
          <a
            href="https://tweakcn.com/themes/cmsbjfbp0000204kv5mkv4wlf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#D3AAF1',
              background: 'rgba(138, 80, 229, 0.2)',
              border: '1px solid rgba(138, 80, 229, 0.4)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} /> tweakcn Theme <ExternalLink size={11} />
          </a>
        </div>

        {/* Right security info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={14} color="#34D399" />
          <span>Read-Only Instagram OAuth Security Verified</span>
        </div>
      </div>
    </footer>
  );
};
