'use client';

import { useEffect, useRef, useState } from 'react';

export default function StorySection({ story }) {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (story?.enabled === false) return null;

  const items = story.items || [];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const raw = (window.scrollY - top) / range;
      const idx = Math.round(Math.max(0, Math.min(1, raw)) * (items.length - 1));
      setActiveIndex(idx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  return (
    <section id="story-section" ref={sectionRef}>
      <div className="story-sticky">
        <div className="story-text">
          <span className="sec-label">{story.subheading}</span>
          <h2 className="sec-heading">{story.heading}</h2>
          <span className="story-chapter">{items[activeIndex]?.caption}</span>
          <p className="story-p">{items[activeIndex]?.text}</p>
        </div>
        
        <div className="ls-stack">
          {items.map((item, i) => {
            let className = 'ls-card';
            let style = {};
            
            if (i < activeIndex) {
              className += ' stacked';
              style['--d'] = activeIndex - i;
            } else if (i === activeIndex) {
              className += ' visible';
            }
            
            return (
              <div key={i} className={className} style={style}>
                <img src={item.image} alt={item.caption} loading="lazy" />
                <div className="ls-caption"><span>{item.caption}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
