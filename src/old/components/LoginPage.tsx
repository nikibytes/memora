import React, { useState } from 'react';
import { Lock, ShieldCheck, Instagram, ArrowRight, CheckCircle2, Loader2, Sparkles, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);

  const SYNC_STEPS = [
    'Connecting to Instagram OAuth endpoint...',
    'Fetching 502 saved reels, carousels & posts...',
    'Extracting location metadata & OCR text...',
    'Generating vector embeddings (Supabase pgvector)...',
    'Sync complete! Launching dashboard...'
  ];

  const handleSimulatedLogin = (user: string) => {
    setIsSyncing(true);
    setSyncStep(0);

    const interval = setInterval(() => {
      setSyncStep((prev) => {
        if (prev >= SYNC_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onLoginSuccess(user);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div style={{
      maxWidth: '540px',
      margin: '40px auto 60px',
      padding: '0 20px'
    }}>
      <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
        {/* Logo badge */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, rgba(138, 80, 229, 0.25), rgba(168, 85, 247, 0.5))',
          border: '1px solid rgba(138, 80, 229, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 30px rgba(138, 80, 229, 0.4)'
        }}>
          <img src="/app/assets/logo.svg" alt="Memora Logo" style={{ width: '48px', height: '48px' }} />
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          Connect Instagram
        </h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem', marginBottom: '32px' }}>
          Sync your saved posts to enable natural language semantic search & location retrieval.
        </p>

        {isSyncing ? (
          /* Live Syncing Progress View */
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(138, 80, 229, 0.4)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Loader2 className="animate-spin" size={20} color="#A855F7" />
              <span style={{ fontWeight: 600, color: '#D3AAF1' }}>Syncing Instagram Account</span>
            </div>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <div style={{
                height: '100%',
                width: `${((syncStep + 1) / SYNC_STEPS.length) * 100}%`,
                background: 'linear-gradient(90deg, #8A50E5, #EC4899)',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {/* Steps log */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SYNC_STEPS.map((step, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  color: idx <= syncStep ? '#FFF' : 'var(--muted-foreground)',
                  opacity: idx <= syncStep ? 1 : 0.4
                }}>
                  {idx < syncStep ? (
                    <CheckCircle2 size={16} color="#34D399" />
                  ) : idx === syncStep ? (
                    <Loader2 className="animate-spin" size={16} color="#A855F7" />
                  ) : (
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border)' }} />
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Normal Login Buttons */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Instagram OAuth Button */}
            <button
              onClick={() => handleSimulatedLogin('@alex.creatives')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                border: 'none',
                borderRadius: '999px',
                padding: '14px 24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1rem',
                boxShadow: '0 6px 20px rgba(225, 48, 108, 0.35)',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Instagram size={20} />
              <span>Continue with Instagram OAuth</span>
            </button>

            {/* Quick Demo Login Button */}
            <button
              onClick={() => handleSimulatedLogin('@alex.creatives')}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px 24px',
                fontSize: '0.95rem'
              }}
            >
              <UserCheck size={18} color="#A855F7" />
              <span>1-Click Demo Login (@alex.creatives)</span>
            </button>
          </div>
        )}

        {/* Security & Read-Only Guarantees */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            <ShieldCheck size={18} color="#34D399" />
            <span><strong>Read-Only Access Scope:</strong> We strictly view your saved collections list. We cannot post or modify your account.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            <Lock size={18} color="#8A50E5" />
            <span><strong>Encrypted & Private:</strong> Vector embeddings stored securely in Supabase with user-isolated row level security.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
