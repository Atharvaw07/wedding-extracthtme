'use client';

import { useState } from 'react';

const RSVP_API_BASE =
  process.env.NEXT_PUBLIC_WEDDING_API_URL || 'https://wedding-backend-k67l.onrender.com';
const RSVP_API = `${RSVP_API_BASE.replace(/\/$/, '')}/api/rsvp`;

export default function RSVPSection({ rsvp, events, onShowModal }) {
  const [loading, setLoading] = useState(false);
  const [attending, setAttending] = useState('yes');

  if (rsvp?.enabled === false) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
      if (key === 'attending_events') {
        const values = formData.getAll(key);
        data[key] = values.join(', ');
      } else {
        data[key] = value;
      }
    }

    if (data.attending === 'no') {
      data.guest_count = "0";
      data.attending_events = "None";
    }

    data.clientId =
      process.env.NEXT_PUBLIC_CLIENT_ID || rsvp?.clientId || 'default-client-id';

    try {
      const res = await fetch(RSVP_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      onShowModal(result.success ? 'success' : 'error');
      if (result.success) e.target.reset();
    } catch (err) {
      console.error(err);
      onShowModal('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp-section" className="reveal revealed">
      <div className="rsvp-wrap">
        <div className="tc" style={{ marginBottom: '2.5rem' }}>
          <span className="sec-label">Join the Celebration</span>
          <h2 className="sec-heading">RSVP</h2>
          <p className="rsvp-intro">{rsvp.wording}</p>
        </div>

        <form onSubmit={handleSubmit} className="rsvp-form">
          <div className="rsvp-card">
            <p className="rsvp-card-title">Your details</p>
            <div className="field-group">
              <label className="field-label" htmlFor="f-name">Your name</label>
              <input className="field-input" type="text" id="f-name" name="name" required placeholder="Full name" />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="f-phone">Phone number</label>
              <input className="field-input" type="tel" id="f-phone" name="phone" required placeholder="+91 00000 00000" />
            </div>
          </div>

          <div className="rsvp-card">
            <p className="rsvp-card-title">Will you join us?</p>
            <div className="radio-pill-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label className="radio-pill">
                <input type="radio" name="attending" value="yes" checked={attending === 'yes'} onChange={() => setAttending('yes')} />
                Joyfully accept 🎉
              </label>
              <label className="radio-pill">
                <input type="radio" name="attending" value="no" checked={attending === 'no'} onChange={() => setAttending('no')} />
                Regrettably decline
              </label>
            </div>
          </div>

          <div id="extra-fields" style={{ opacity: attending === 'no' ? 0.4 : 1, pointerEvents: attending === 'no' ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
            <div className="rsvp-card">
              <p className="rsvp-card-title">Party size</p>
              <div className="field-group">
                <select className="field-input" name="guest_count" required>
                  <option value="1">1 (Just me)</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                  <option value="6+">6+ guests</option>
                </select>
              </div>
            </div>

            <div className="rsvp-card">
              <p className="rsvp-card-title">Events you'll attend</p>
              <div className="checkbox-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {events?.items?.map((item, i) => (
                  <label key={i} className="checkbox-pill" style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '1rem', 
                    padding: '0.85rem 1rem', 
                    background: 'var(--cream)', 
                    border: '1.5px solid var(--border)', 
                    borderRadius: '0.85rem' 
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, display: 'block' }}>{item.title}</span>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'long' })} · {item.time}
                      </small>
                    </div>
                    <input type="checkbox" name="attending_events" value={item.title} style={{ width: '20px', height: '20px' }} />
                  </label>
                ))}
              </div>
            </div>

            <div className="rsvp-card">
              <p className="rsvp-card-title">A song for the dance floor</p>
              <div className="field-group">
                <input className="field-input" type="text" name="song_request" placeholder="e.g. Kala Chashma" />
              </div>
            </div>

            <div className="rsvp-card">
              <p className="rsvp-card-title">Marriage advice for us</p>
              <div className="field-group">
                <textarea className="field-textarea" name="marriage_advice" placeholder="Share something sweet, funny, or wise..."></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send RSVP'}
          </button>
        </form>
      </div>
    </section>
  );
}
