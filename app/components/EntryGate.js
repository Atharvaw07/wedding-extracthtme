'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** Fixed wax seal art — not editable in the form. */
export const WAX_SEAL_IMAGE_URL =
  'https://pub-1953a6673e864f3488c645252f75de98.r2.dev/may/Demo/Best%20Website%20Invite%20Demo%20(2).png';

export default function EntryGate({ entry, onOpen }) {
  const gateRef = useRef(null);
  const envelopeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { envelopeImage, initials, message } = entry || {};

  const envImg = envelopeImage ? `url("${envelopeImage}")` : 'none';
  const slImg = `url("${WAX_SEAL_IMAGE_URL}")`;

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(gateRef.current, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            if (gateRef.current) gateRef.current.style.display = 'none';
          }
        });
      }
    });

    tl.to('.tap-hint, .envelope__message', {
      opacity: 0,
      y: (i) => (i === 0 ? -20 : 20),
      duration: 0.8,
      ease: 'power2.in',
    }, 0)
    .to('.seal', {
      scale: 1.25,
      rotation: 8,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.in',
    }, 0.2)
    .add(() => { if (onOpen) onOpen(); }, 0.8) // Start revealing content behind flaps
    .to('.flap--top',    { yPercent: -150, duration: 2.8, ease: 'expo.inOut' }, 0.8)
    .to('.flap--bottom', { yPercent:  150, duration: 2.8, ease: 'expo.inOut' }, 0.8)
    .to('.flap--left',   { xPercent: -150, duration: 2.8, ease: 'expo.inOut' }, 0.8)
    .to('.flap--right',  { xPercent:  150, duration: 2.8, ease: 'expo.inOut' }, 0.8)
    .to('.reveal-flash', {
      opacity: 0.6,
      scale: 1.2,
      duration: 0.8,
      ease: 'power1.out',
    }, 1.0)
    .to('.reveal-flash', {
      opacity: 0,
      scale: 1.6,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 1.8);
  };

  if (entry?.enabled === false) {
    if (onOpen) onOpen();
    return null;
  }

  return (
    <div 
      id="entry-gate" 
      className="entry-gate-container" 
      ref={gateRef}
      onClick={handleOpen}
    >
      {/* Hidden eager-load images for instant background availability */}
      {envelopeImage && <img src={envelopeImage} style={{ display: 'none' }} loading="eager" fetchPriority="high" alt="" />}
      <img src={WAX_SEAL_IMAGE_URL} style={{ display: 'none' }} loading="eager" fetchPriority="high" alt="" />

      <div 
        className="frame" 
        id="envelope" 
        ref={envelopeRef}
        role="button" 
        tabIndex="0" 
        aria-label="Sealed envelope. Tap to open."
      >
        <div className="flap flap--top" style={{ backgroundImage: envImg }} />
        <div className="flap flap--bottom" style={{ backgroundImage: envImg }} />
        <div className="flap flap--left" style={{ backgroundImage: envImg }} />
        <div className="flap flap--right" style={{ backgroundImage: envImg }} />

        <div className="tap-hint" aria-hidden="true">
          <span className="tap-hint__text">Tap to reveal</span>
          <span className="tap-hint__rule" />
        </div>

        <div className="seal" aria-hidden="true">
          <div className="seal__image" style={{ backgroundImage: slImg }} />
          <div className="seal__initials">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="initial-emboss" x="-20%" y="-20%" width="140%" height="140%">
                  <feOffset in="SourceAlpha" dx="-1.1" dy="-1.1" result="hi-shape"/>
                  <feFlood floodColor="#f4e3c4" floodOpacity="0.85"/>
                  <feComposite operator="in" in2="hi-shape" result="hi"/>
                  <feGaussianBlur in="hi" stdDeviation="0.3" result="hi-blur"/>
                  <feOffset in="SourceAlpha" dx="2.2" dy="2.6" result="sh-shape"/>
                  <feFlood floodColor="#3a2410" floodOpacity="0.68"/>
                  <feComposite operator="in" in2="sh-shape" result="sh"/>
                  <feGaussianBlur in="sh" stdDeviation="1.1" result="sh-blur"/>
                  <feMerge>
                    <feMergeNode in="sh-blur"/>
                    <feMergeNode in="hi-blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#initial-emboss)">
                <text className="initials__letter" x="70" y="112" textAnchor="middle">{initials?.left}</text>
                <text className="initials__amp" x="102" y="128" textAnchor="middle">&amp;</text>
                <text className="initials__letter" x="134" y="142" textAnchor="middle">{initials?.right}</text>
              </g>
            </svg>
          </div>
        </div>

        <div className="reveal-flash" aria-hidden="true" />

        <div className="envelope__message" aria-hidden="true">
          {message?.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </div>
      </div>
    </div>
  );
}
