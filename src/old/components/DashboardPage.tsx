import React, { useState, useMemo } from 'react';
import { MOCK_COLLECTIONS, MOCK_POSTS, SavedPost, CollectionCategory } from '../data/mockCollections';
import { 
  Search, MapPin, Filter, Sparkles, Instagram, Bookmark, ExternalLink, 
  Grid, List as ListIcon, Play, RefreshCw, X, Tag, Music, FileText, CheckCircle2, Navigation
} from 'lucide-react';

interface DashboardPageProps {
  username: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ username }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModalPost, setActiveModalPost] = useState<SavedPost | null>(null);
  const [postsList, setPostsList] = useState<SavedPost[]>(MOCK_POSTS);

  // Available locations extracted from posts
  const LOCATIONS = ['all', 'Tokyo', 'San Francisco', 'New York', 'Paris', 'London'];

  // Toggle bookmark local state
  const toggleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostsList(prev => prev.map(p => p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p));
  };

  // Filter logic for search, collection, location, and media type
  const filteredPosts = useMemo(() => {
    return postsList.filter(post => {
      // Collection filter
      if (selectedCollection !== 'all' && post.collectionId !== selectedCollection) {
        return false;
      }
      // Location filter
      if (selectedLocation !== 'all' && post.location.city !== selectedLocation) {
        return false;
      }
      // Media type filter
      if (selectedMediaType !== 'all' && post.mediaType !== selectedMediaType) {
        return false;
      }
      // Search query filter (semantic & keyword match across caption, title, handle, tags, ocr, location)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesCaption = post.caption.toLowerCase().includes(q);
        const matchesHandle = post.handle.toLowerCase().includes(q);
        const matchesLocation = post.location.city.toLowerCase().includes(q) || post.location.country.toLowerCase().includes(q);
        const matchesTags = post.tags.some(t => t.toLowerCase().includes(q));
        const matchesSummary = post.aiSummary.toLowerCase().includes(q);
        const matchesOcr = post.ocrSnippet?.toLowerCase().includes(q);
        return matchesTitle || matchesCaption || matchesHandle || matchesLocation || matchesTags || matchesSummary || matchesOcr;
      }

      return true;
    });
  }, [postsList, selectedCollection, searchQuery, selectedLocation, selectedMediaType]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 20px' }}>
      
      {/* Instagram Profile Status Banner */}
      <div className="glass-panel" style={{
        padding: '24px 30px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(138, 80, 229, 0.15) 0%, rgba(22, 18, 33, 0.85) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Profile"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px solid #8A50E5',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#34D399',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '2px solid var(--background)'
            }} title="Account Synced" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                {username || '@alex.creatives'}
              </h2>
              <span className="badge-tag" style={{ fontSize: '0.72rem' }}>
                <Instagram size={12} /> Connected
              </span>
            </div>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.88rem', marginTop: '4px' }}>
              502 Saved Posts · 6 Collections · 34 Tagged Cities · Last synced 2 mins ago
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            onClick={() => alert('Re-syncing latest saved Instagram posts from OAuth feed...')}
          >
            <RefreshCw size={14} /> Sync Saves
          </button>
        </div>
      </div>

      {/* Main Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          padding: '12px 20px',
          marginBottom: '16px'
        }}>
          <Search size={20} color="#8A50E5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search captions, location, audio or "that reel about cold emails"...'
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFF',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <X 
              size={18} 
              style={{ cursor: 'pointer', color: 'var(--muted-foreground)' }} 
              onClick={() => setSearchQuery('')} 
            />
          )}
          <span style={{ fontSize: '0.82rem', color: '#D3AAF1', background: 'rgba(138, 80, 229, 0.2)', padding: '4px 10px', borderRadius: '999px' }}>
            <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} /> Vector Match
          </span>
        </div>

        {/* Quick Filter Pills (Location, Media Type & View Mode) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Location Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="#3B82F6" /> City:
            </span>
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                style={{
                  background: selectedLocation === loc ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedLocation === loc ? '#60A5FA' : 'var(--foreground)',
                  border: selectedLocation === loc ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid var(--border)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: selectedLocation === loc ? 600 : 400,
                  cursor: 'pointer'
                }}
              >
                {loc === 'all' ? 'All Cities' : loc}
              </button>
            ))}
          </div>

          {/* Media Type & View Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'reel', 'carousel'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedMediaType(type)}
                  style={{
                    background: selectedMediaType === type ? 'rgba(138, 80, 229, 0.25)' : 'transparent',
                    color: selectedMediaType === type ? '#D3AAF1' : 'var(--muted-foreground)',
                    border: '1px solid var(--border)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type === 'all' ? 'All Types' : type + 's'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                  border: 'none',
                  color: '#FFF',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                  border: 'none',
                  color: '#FFF',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title="List View"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Row Selector */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            Collections
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            Showing {filteredPosts.length} posts
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {/* All Posts Card */}
          <div
            onClick={() => setSelectedCollection('all')}
            className="glass-card"
            style={{
              padding: '16px',
              cursor: 'pointer',
              borderColor: selectedCollection === 'all' ? '#8A50E5' : 'var(--border)',
              background: selectedCollection === 'all' ? 'rgba(138, 80, 229, 0.18)' : undefined
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📁</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>All Collections</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
              {MOCK_POSTS.length} posts saved
            </div>
          </div>

          {/* Individual Category Cards */}
          {MOCK_COLLECTIONS.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCollection(cat.id)}
              className="glass-card"
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderColor: selectedCollection === cat.id ? '#8A50E5' : 'var(--border)',
                background: selectedCollection === cat.id ? 'rgba(138, 80, 229, 0.18)' : undefined
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cat.name.replace(/^[\p{Emoji}\s]+/u, '')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '4px' }}>
                {cat.postCount} posts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts Feed Section */}
      <div>
        {filteredPosts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Search size={48} color="#8A50E5" style={{ marginBottom: '16px', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No matching saved posts found</h3>
            <p style={{ color: 'var(--muted-foreground)' }}>Try clearing filters or searching for another keyword like "Tokyo", "AI", or "Ramen".</p>
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            flexDirection: viewMode === 'list' ? 'column' : undefined,
            gap: '24px'
          }}>
            {filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setActiveModalPost(post)}
                className="glass-card"
                style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: viewMode === 'list' ? 'row' : 'column'
                }}
              >
                {/* Media Thumbnail Container */}
                <div style={{
                  position: 'relative',
                  width: viewMode === 'list' ? '220px' : '100%',
                  height: viewMode === 'list' ? 'auto' : '220px',
                  minHeight: '180px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />

                  {/* Media Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {post.mediaType === 'reel' ? <Play size={12} fill="#FFF" /> : <Grid size={12} />}
                    <span style={{ textTransform: 'capitalize' }}>{post.mediaType}</span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleBookmark(post.id, e)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      color: post.isBookmarked ? '#A855F7' : '#FFF',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Bookmark size={16} fill={post.isBookmarked ? '#A855F7' : 'none'} />
                  </button>

                  {/* Location Overlay Pill */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#60A5FA',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <MapPin size={12} />
                    <span>{post.location.flag} {post.location.city}</span>
                  </div>
                </div>

                {/* Card Info Body */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* User handle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <img src={post.avatar} alt={post.handle} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                        {post.handle}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginLeft: 'auto' }}>
                        {post.savedDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                      {post.title}
                    </h4>

                    {/* AI Summary */}
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--muted-foreground)',
                      lineHeight: 1.5,
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {post.aiSummary}
                    </p>
                  </div>

                  {/* Tags & Actions */}
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="badge-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '12px',
                      fontSize: '0.8rem',
                      color: 'var(--muted-foreground)'
                    }}>
                      <span>❤️ {post.likes}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#A855F7', fontWeight: 600 }}>
                        View Details <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Post Modal */}
      {activeModalPost && (
        <div className="modal-overlay" onClick={() => setActiveModalPost(null)}>
          <div
            className="glass-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(900px, 94vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '0',
              borderRadius: '24px',
              border: '1px solid rgba(138, 80, 229, 0.4)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={activeModalPost.avatar} alt={activeModalPost.handle} style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeModalPost.handle}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>Saved {activeModalPost.savedDate}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveModalPost(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#FFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body split */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {/* Media Preview Column */}
              <div style={{ position: 'relative', background: '#000', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={activeModalPost.thumbnailUrl}
                  alt={activeModalPost.title}
                  style={{ width: '100%', maxHeight: '460px', objectFit: 'cover' }}
                />
                {activeModalPost.mediaType === 'reel' && (
                  <div style={{
                    position: 'absolute',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(138, 80, 229, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(138, 80, 229, 0.8)'
                  }}>
                    <Play size={28} fill="#FFF" color="#FFF" style={{ marginLeft: '4px' }} />
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <span className="badge-tag" style={{ marginBottom: '8px' }}>
                    {activeModalPost.location.flag} {activeModalPost.location.placeName}, {activeModalPost.location.city}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '8px', lineHeight: 1.3 }}>
                    {activeModalPost.title}
                  </h3>
                </div>

                <div style={{
                  background: 'rgba(138, 80, 229, 0.12)',
                  border: '1px solid rgba(138, 80, 229, 0.3)',
                  padding: '14px',
                  borderRadius: '14px',
                  fontSize: '0.88rem'
                }}>
                  <div style={{ fontWeight: 700, color: '#D3AAF1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> AI Semantic Summary
                  </div>
                  <p style={{ color: 'var(--foreground)', lineHeight: 1.5 }}>
                    {activeModalPost.aiSummary}
                  </p>
                </div>

                {activeModalPost.audioTitle && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                    <Music size={14} color="#A855F7" />
                    <span>{activeModalPost.audioTitle}</span>
                  </div>
                )}

                {activeModalPost.ocrSnippet && (
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '0.82rem',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={13} /> Extracted Visual OCR Text:
                    </div>
                    <code style={{ color: '#F472B6', fontFamily: 'monospace' }}>"{activeModalPost.ocrSnippet}"</code>
                  </div>
                )}

                <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  {activeModalPost.caption}
                </div>

                {/* External Instagram Link */}
                <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                  <a
                    href={activeModalPost.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Instagram size={18} />
                    <span>Open on Instagram</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
