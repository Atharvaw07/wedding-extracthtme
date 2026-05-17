'use client';

function dressCodeNamesDisplay(names) {
  if (names == null || names === '') return '';
  if (typeof names === 'string') return names;
  if (Array.isArray(names)) return names.filter(Boolean).map(String).join(' · ');
  return '';
}

function EventCard({ item }) {
  const isVideo = item.image?.match(/\.(mp4|webm|mov)(\?|#|$)/i);
  const style = item.inviteStyle || 'light';
  const overlayClass = `event-invite-overlay event-invite--${style}`;

  return (
    <div className="event-block reveal revealed">
      <div className="evt-img-wrap" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '9/16' }}>
        {isVideo ? (
          <video
            src={item.image}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        ) : (
          <img src={item.image} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        
        {/* Terracotta-style Overlay & Text Logic with Variants */}
        <div className={overlayClass}>
          <div className="event-invite-stack">
            <h3 className="event-overlay-title">{item.title}</h3>
            
            <div className="event-overlay-date-row">
              <span className="overlay-line"></span>
              {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '')}
              <span className="overlay-line"></span>
            </div>

            <p className="event-overlay-time">{item.time}</p>
          </div>
        </div>
      </div>

      <div className={`evt-card reveal reveal-d1 ${item.highlighted ? 'highlighted' : ''}`} 
           style={item.highlighted ? { borderColor: 'var(--gold-light)', background: 'linear-gradient(135deg, var(--sage-pale), var(--white))' } : {}}>
        <div className="evt-info">
          <span className="evt-name" style={item.highlighted ? { color: 'var(--sage-deep)', fontSize: 'clamp(2.4rem,6vw,3.2rem)' } : {}}>{item.title}</span>
          <span className="evt-time">{item.time}</span>
          <span className="evt-desc">{item.description}</span>
        </div>
      </div>

      <div className="evt-details reveal reveal-d2">
        <div className="evt-venue">
          <span className="evt-venue-name">{item.venue}</span>
          {item.mapsUrl && (
            <a className="evt-dir-btn" href={item.mapsUrl} target="_blank" rel="noopener noreferrer">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </a>
          )}
        </div>
        
        {item.dressCode?.enabled && (
          <div className="evt-dresscode">
            <span className="evt-dresscode-lbl">Dress code</span>
            <div className="evt-dresscode-dots">
              {item.dressCode.colors?.map((color, i) => (
                <span key={i} className="evt-dresscode-dot" style={{ background: color }} />
              ))}
            </div>
            <span className="evt-dresscode-names">{dressCodeNamesDisplay(item.dressCode.names)}</span>
            <span className="evt-dresscode-note">{item.dressCode.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsSection({ events }) {
  if (events?.enabled === false) return null;

  const items = events.items || [];

  return (
    <section id="events-section">
      <div className="tc reveal revealed" style={{ marginBottom: '1rem' }}>
        <span className="sec-label">{events.subheading}</span>
        <h2 className="sec-heading">{events.heading}</h2>
      </div>

      {items.map((item, i) => (
        <EventCard key={i} item={item} />
      ))}
    </section>
  );
}
