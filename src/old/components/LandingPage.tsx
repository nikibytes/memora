import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Zap, Layers, Lock, Compass, ArrowRight, CheckCircle2, Bookmark, Flame } from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo, onLoginClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const SUGGESTED_QUERIES = [
    'that reel about cold emails',
    'tokyo secret matcha bar',
    'framer motion spring animation',
    'slow cooked tonkotsu ramen',
    'hip thoracic mobility routine'
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '60px 20px 40px',
        maxWidth: '960px',
        margin: '0 auto'
      }}>
        {/* Top Feature Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(138, 80, 229, 0.15)',
          border: '1px solid rgba(138, 80, 229, 0.3)',
          color: '#D3AAF1',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={16} color="#A855F7" />
          <span>Next-Gen Semantic Vector Search for Instagram Saves</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #E2D3F5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Search anything you've <span style={{
            background: 'linear-gradient(135deg, #8A50E5 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ever saved.</span>
        </h1>

        <p style={{
          fontSize: '1.18rem',
          color: 'var(--muted-foreground)',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Memora indexes captions, location tags, OCR text & audio transcripts from your saved Instagram reels, carousels and posts so you can find anything instantly.
        </p>

        {/* Interactive Search Bar Simulator */}
        <div className="glass-card" style={{
          padding: '12px 18px',
          maxWidth: '740px',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderRadius: '999px',
          boxShadow: '0 10px 40px rgba(138, 80, 229, 0.25)',
          border: '1px solid rgba(138, 80, 229, 0.4)'
        }}>
          <Search size={22} color="#8A50E5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Try typing "that reel about cold email templates..."'
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFF',
              fontSize: '1.05rem',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={onStartDemo}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.92rem' }}
          >
            <span>Search</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Query Suggestion Chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '50px'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', alignSelf: 'center', marginRight: '4px' }}>
            Popular queries:
          </span>
          {SUGGESTED_QUERIES.map((query, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(query);
                onStartDemo();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                color: '#E2D3F5',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(138, 80, 229, 0.5)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              ✨ {query}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700 }}>
            Built for power savers who collect inspiration
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '8px' }}>
            No more scrolling endlessly through thousands of saved posts looking for that one recipe or travel tip.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Feature 1 */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(138, 80, 229, 0.2)',
              border: '1px solid rgba(138, 80, 229, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Zap size={26} color="#A855F7" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
              Natural Language Semantic Search
            </h3>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Enter vague phrases like "minimal desktop workspace" or "how to pitch investors" and pgvector matches conceptual meaning, not just exact keywords.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <MapPin size={26} color="#3B82F6" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
              Location-Aware Retrieval
            </h3>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Traveling to Tokyo, Paris, or NYC? Instantly retrieve all saved posts tagged in that city or neighborhood on an interactive view.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(236, 72, 153, 0.2)',
              border: '1px solid rgba(236, 72, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Layers size={26} color="#EC4899" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
              Audio & OCR Text Extraction
            </h3>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Don't worry if the caption was blank. We transcribe reel audio and extract text embedded inside images so zero information is missed.
            </p>
          </div>
        </div>
      </section>

      {/* Live Stats Counter Banner */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 80px',
        padding: '30px 40px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(138, 80, 229, 0.15) 0%, rgba(30, 25, 45, 0.8) 100%)',
        border: '1px solid rgba(138, 80, 229, 0.3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#D3AAF1' }}>50,000+</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>Saved Posts Indexed</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#A855F7' }}>99.4%</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>Search Relevance Accuracy</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38BDF8' }}>Offline PWA</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>Instant Offline Access</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F472B6' }}>1-Click Sync</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>Auto Instagram OAuth</div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
          Ready to unlock your saved Instagram collections?
        </h2>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '28px', fontSize: '1.05rem' }}>
          Connect your Instagram account or explore our interactive live demo in 1 click.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={onLoginClick}
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            <span>Connect Instagram Account</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onStartDemo}
            className="btn-secondary"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            <span>Launch Live Demo</span>
          </button>
        </div>
      </section>
    </div>
  );
};
