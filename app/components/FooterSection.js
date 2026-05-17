'use client';

export default function FooterSection({ footer }) {
  if (footer?.enabled === false) return null;

  return (
    <section id="footer-section">
      <div className="tc reveal revealed">
        <p className="footer-msg">
          {footer.message?.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </p>
        <span style={{ 
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '.85rem', 
          fontWeight: 600, 
          letterSpacing: '.2em', 
          textTransform: 'uppercase', 
          color: 'var(--text-mid)', 
          display: 'block', 
          marginBottom: '1rem' 
        }}>Warm regards,</span>
        <span style={{ 
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '1.4rem', 
          color: 'var(--sage-dark)', 
          fontStyle: 'italic', 
          display: 'block' 
        }}>{footer.regards}</span>
        <span className="footer-name" style={{ marginTop: '3rem' }}>{footer.couple}</span>
        <div className="footer-credit">
          MADE WITH <span style={{ color: '#e74c3c' }}>♥</span> BY{' '}
          <a href="https://instagram.com/invitevibes" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            @INVITEVIBES
          </a>
        </div>
      </div>
    </section>
  );
}
