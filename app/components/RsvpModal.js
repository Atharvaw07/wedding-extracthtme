'use client';

export default function RsvpModal({ type, onClose }) {
  if (!type) return null;

  const isSuccess = type === 'success';

  return (
    <div id="rsvp-modal" className="open" onClick={(e) => e.target.id === 'rsvp-modal' && onClose()}>
      <div className="modal-card">
        <div className="modal-icon" style={{ background: isSuccess ? 'rgba(138,79,76,0.1)' : 'rgba(220,38,38,0.08)' }}>
          {isSuccess ? (
            <svg fill="none" stroke="var(--sage-deep)" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <p className="modal-title" style={{ color: isSuccess ? 'var(--sage-deep)' : '#dc2626' }}>
          {isSuccess ? 'Thank you!' : 'Oops!'}
        </p>
        <p className="modal-msg">
          {isSuccess 
            ? "We can't wait to celebrate with you on our special day!" 
            : 'There was an error submitting your RSVP. Please try again.'}
        </p>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
