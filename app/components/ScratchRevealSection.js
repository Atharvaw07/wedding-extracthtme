'use client';

import { useEffect, useRef, useState } from 'react';

function ScratchCard({ id, label, value, onDone }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;

    const ctx = cvs.getContext('2d', { WillReadFrequently: true });
    const dpr = window.devicePixelRatio || 1;

    function build() {
      const r = wrap.getBoundingClientRect();
      const W = r.width;
      const H = r.height;
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      ctx.scale(dpr, dpr);

      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#EAC9C7');
      g.addColorStop(0.5, '#BA7A76');
      g.addColorStop(1, '#EAC9C7');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.font = "italic 600 13px 'Cormorant Garamond'";
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('scratch me', W / 2, H / 2);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(42, W * 0.36);
      setReady(true);
    }

    setTimeout(build, 100);
  }, []);

  const handlePointerMove = (e) => {
    if (!ready || done) return;
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    const r = cvs.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    const x = s.clientX - r.left;
    const y = s.clientY - r.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    check(cvs, ctx);
  };

  const handlePointerDown = (e) => {
    if (!ready || done) return;
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    const r = cvs.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    const x = s.clientX - r.left;
    const y = s.clientY - r.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const check = (cvs, ctx) => {
    if (done) return;
    const d = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
    let clear = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] === 0) clear++;
    if (clear / (cvs.width * cvs.height) > 0.48) {
      setDone(true);
      onDone();
    }
  };

  return (
    <div className="scratch-unit">
      <span className="scratch-lbl">{label}</span>
      <div className={`scratch-card ${done ? 'glow' : ''}`} ref={wrapRef}>
        <div className="scratch-inner">
          <div className="sc-val">{value}</div>
          <div className="sc-rule" />
        </div>
        {!done && (
          <canvas
            className="scratch-canvas"
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
          />
        )}
      </div>
      {!done && <span className="scratch-hint">↑ scratch</span>}
    </div>
  );
}

export default function ScratchRevealSection({ saveTheDate, onAllScratched }) {
  const [doneCount, setDoneCount] = useState(0);

  if (saveTheDate?.enabled === false) return null;

  const date = new Date(saveTheDate?.weddingDate);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  useEffect(() => {
    if (doneCount === 3) {
      onAllScratched();
    }
  }, [doneCount, onAllScratched]);

  const handleDone = () => {
    setDoneCount(prev => prev + 1);
  };

  return (
    <section id="scratch-section" className="reveal revealed">
      <span className="sec-label">The Date</span>
      <h2 className="sec-heading">Save the Date</h2>
      <p style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '1.05rem', marginTop: '.25rem' }}>
        {saveTheDate?.wording || "Scratch below to reveal our wedding date"}
      </p>
      <div className="scratch-row">
        <ScratchCard label="Month" value={month} onDone={handleDone} />
        <ScratchCard label="Day" value={day} onDone={handleDone} />
        <ScratchCard label="Year" value={year} onDone={handleDone} />
      </div>
    </section>
  );
}
