'use client';

export default function HeroSection({ hero, onScrollDown }) {
  if (hero?.enabled === false) return null;

  const { ganeshImageUrl, blessingsIntro, bride, groom } = hero;

  return (
    <section id="hero">
      <div className="hero-corner"><span></span></div>
      <div className="hero-card reveal revealed">
        {ganeshImageUrl && (
          <img
            src={ganeshImageUrl}
            alt="Religious symbol"
            className="hero-icon"
            width={80}
            height={80}
          />
        )}
        <p className="intro-text">
          {blessingsIntro?.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
        
        <span className="couple-name shimmer">{bride?.name}</span>
        <span className="parent-sub">{bride?.familyLine}</span>
        
        <div className="amp-row">
          <div className="amp-line"></div>
          <span className="amp">&</span>
          <div className="amp-line"></div>
        </div>
        
        <span className="couple-name shimmer">{groom?.name}</span>
        <span className="parent-sub">{groom?.familyLine}</span>
      </div>
      
      <div className="scroll-indicator" onClick={onScrollDown}>
        <span>Scroll to Reveal</span>
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
