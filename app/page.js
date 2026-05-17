'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { mergeSiteData } from './mergeSiteData';
import defaultData from '../data.json';

// Components
import Petals from './components/Petals';
import EntryGate, { WAX_SEAL_IMAGE_URL } from './components/EntryGate';
import AudioControl from './components/AudioControl';
import HeroSection from './components/HeroSection';
import ScratchRevealSection from './components/ScratchRevealSection';
import CountdownSection from './components/CountdownSection';
import StorySection from './components/StorySection';
import EventsSection from './components/EventsSection';
import RSVPSection from './components/RSVPSection';
import FooterSection from './components/FooterSection';
import RsvpModal from './components/RsvpModal';

const API = process.env.NEXT_PUBLIC_PLATFORM_API_URL || 'http://localhost:5000';

function WeddingPageInner() {
  const searchParams = useSearchParams();
  const pid = searchParams?.get('pid');

  const [siteData, setSiteData] = useState(defaultData);
  const [dataReady, setDataReady] = useState(!pid);
  const [unlocked, setUnlocked] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    if (!pid) return;
    fetch(`${API}/api/preview/${pid}/data`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.project?.data) {
          setSiteData(mergeSiteData(defaultData, res.project.data));
        }
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, [pid]);

  const handleEntryOpen = () => {
    setAudioStarted(true);
    document.getElementById('main-content').classList.add('visible');
    document.body.style.overflow = 'auto';
    
    // Initialize reveal on scroll
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); io.unobserve(e.target); } });
    },{threshold:.1});
    items.forEach(el => io.observe(el));
  };

  const handleAllScratched = () => {
    setUnlocked(true);
    
    // Confetti effect
    const COLS=['#E2B4B1','#FDFBF7','#D4AF37','#BA7A76'];
    const opts={colors:COLS,zIndex:99999};
    setTimeout(()=>confetti({...opts,particleCount:200,spread:100,origin:{x:.5,y:.65}}),100);
    setTimeout(()=>confetti({...opts,particleCount:120,angle:60,spread:65,origin:{x:0,y:.7}}),400);
    setTimeout(()=>confetti({...opts,particleCount:120,angle:120,spread:65,origin:{x:1,y:.7}}),600);

    setTimeout(() => {
      const countdown = document.getElementById('countdown-section');
      if (countdown) countdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2500);
  };

  const handleScrollToReveal = () => {
    const scratch = document.getElementById('scratch-section');
    if (scratch) scratch.scrollIntoView({ behavior: 'smooth' });
  };

  if (!dataReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        Loading…
      </div>
    );
  }

  return (
    <main>
      {/* Preload critical entry images */}
      {siteData.entry?.envelopeImage && (
        <link rel="preload" as="image" href={siteData.entry.envelopeImage} />
      )}
      <link rel="preload" as="image" href={WAX_SEAL_IMAGE_URL} />

      <AudioControl audio={siteData.audio} autoPlayTrigger={audioStarted} />
      <Petals enabled={siteData.petalsEnabled} />
      
      <EntryGate entry={siteData.entry} onOpen={handleEntryOpen} />

      <div id="main-content">
        <HeroSection hero={siteData.hero} onScrollDown={handleScrollToReveal} />
        
        <ScratchRevealSection 
          saveTheDate={siteData.saveTheDate} 
          onAllScratched={handleAllScratched} 
        />

        <div id="locked" className={`${unlocked ? 'unlocked visible' : ''}`}>
          <CountdownSection weddingDate={siteData.saveTheDate?.weddingDate} />
          
          <StorySection story={siteData.story} />
          
          <EventsSection events={siteData.events} />
          
          <RSVPSection 
            rsvp={siteData.rsvp} 
            events={siteData.events} 
            onShowModal={(type) => setModalType(type)} 
          />
          
          <FooterSection footer={siteData.footer} />
        </div>
      </div>

      <RsvpModal type={modalType} onClose={() => setModalType(null)} />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}>
      <WeddingPageInner />
    </Suspense>
  );
}
