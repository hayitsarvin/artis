import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// 1. SETUP: Register GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --------------------------------------------------------
// DATA
// --------------------------------------------------------
const CREATORS = [
  { id: 'CX-01', name: "ALEX K.", role: "DIRECTOR", clearance: "OMEGA", img: "1.jpg" },
  { id: 'CX-02', name: "SARAH J.", role: "LEAD WRITER", clearance: "ALPHA", img: "2.jpg" },
  { id: 'CX-03', name: "DAVID R.", role: "VFX LEAD", clearance: "ALPHA", img: "1.jpg" }
];

const ICONS = {
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M8 5v14l11-7z" /></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
  Warn: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
  Activity: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

const EPISODES = [
  { id: 1, title: "The Spark", time: "24:00", desc: "Elara uncovers the first glitch in Sector 7.", img: "https://images.unsplash.com/photo-1614726365723-49cfae927827?q=80&w=1600&auto=format&fit=crop", theme: "#ef4444" },
  { id: 2, title: "The Shield", time: "28:15", desc: "Kale is deployed. First shots fired.", img: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1600&auto=format&fit=crop", theme: "#06b6d4" },
  { id: 3, title: "The Core", time: "32:10", desc: "Mother initiates the purge protocol.", img: "https://images.unsplash.com/photo-1605218427306-022ba8c6f621?q=80&w=1600&auto=format&fit=crop", theme: "#eab308" },
  { id: 4, title: "Reboot", time: "??:??", desc: "A new reality begins to form.", img: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1600&auto=format&fit=crop", theme: "#ffffff" }
];

// --------------------------------------------------------
// UI OVERLAY
// --------------------------------------------------------
const UIOverlay = () => (
  <nav className="fixed top-0 left-0 w-full h-screen z-50 pointer-events-none p-8 md:p-12 flex flex-col justify-between text-white mix-blend-difference">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="font-black text-2xl tracking-tighter leading-none">NEO<span className="opacity-50">GENESIS</span></span>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest opacity-60">LIVE TERMINAL</span>
        </div>
      </div>
      <div className="hidden md:flex gap-8 pointer-events-auto items-center">
        {['ARCHIVES', 'FACTIONS', 'MAP'].map((item) => (
          <a key={item} href="#" className="text-xs font-bold tracking-widest hover:opacity-50 transition-opacity">{item}</a>
        ))}
        <button className="bg-white text-black px-6 py-2 font-bold text-xs tracking-widest uppercase hover:bg-stone-200 transition-colors">Stream Now</button>
      </div>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-mono tracking-widest opacity-50">SYSTEM V9.0 // READY</span>
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono tracking-widest opacity-50" style={{ writingMode: 'vertical-rl' }}>SCROLL TO BEGIN</span>
        <div className="w-px h-12 bg-white/20"><div className="w-full h-1/2 bg-white animate-bounce" /></div>
      </div>
    </div>
  </nav>
);

// --------------------------------------------------------
// 1. HERO SECTION
// --------------------------------------------------------
const Hero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        yPercent: 50, opacity: 0, ease: "none",
        scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom top", scrub: true }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black z-10">
      <div className="absolute inset-0 w-full h-full z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" style={{ filter: 'contrast(1.1) saturate(0)' }}>
          <source src="video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>
      <div ref={textRef} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/60 font-mono text-xs md:text-sm tracking-[0.5em] mb-6 uppercase border-b border-white/20 pb-4">Original Series</p>
        <h1 className="text-[12vw] md:text-[10rem] leading-[0.85] font-black tracking-tighter uppercase text-white mix-blend-overlay">Neo<br/>Genesis</h1>
        <div className="mt-12 flex gap-4 pointer-events-auto">
          <button className="px-8 py-4 border border-white/20 text-white font-mono text-xs tracking-widest hover:bg-white hover:text-black transition-all uppercase">Watch Trailer</button>
        </div>
      </div>
    </header>
  );
};

// --------------------------------------------------------
// 2. SERIES INVITE (RGB Glitch)
// --------------------------------------------------------
const SeriesInvite = () => {
  const containerRef = useRef(null);
  const redRef = useRef(null);
  const cyanRef = useRef(null);
  const whiteRef = useRef(null);

  const handleMouseMove = (e) => {
    // Interactive RGB Split
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    
    gsap.to(redRef.current, { x: x, y: y, duration: 0.1 });
    gsap.to(cyanRef.current, { x: -x, y: -y, duration: 0.1 });
    gsap.to(whiteRef.current, { x: 0, y: 0, duration: 0.1 });
  };

  return (
    <section 
      ref={containerRef} 
      className="w-full min-h-[80vh] bg-[#050505] flex flex-col items-center justify-center relative z-30 border-t border-white/10 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
       <div className="absolute top-12 right-12 flex items-center gap-2">
         <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
         <span className="font-mono text-xs text-red-500 tracking-widest">REC</span>
       </div>
       
       <div className="relative z-10 text-center mix-blend-screen pointer-events-none">
          <h1 ref={redRef} className="text-[8vw] font-black uppercase tracking-tighter leading-[0.8] text-red-600 absolute top-0 left-0 w-full h-full opacity-80" style={{ mixBlendMode: 'screen' }}>
            STREAM THE<br/>REVOLUTION
          </h1>
          <h1 ref={cyanRef} className="text-[8vw] font-black uppercase tracking-tighter leading-[0.8] text-cyan-400 absolute top-0 left-0 w-full h-full opacity-80" style={{ mixBlendMode: 'screen' }}>
            STREAM THE<br/>REVOLUTION
          </h1>
          <h1 ref={whiteRef} className="text-[8vw] font-black uppercase tracking-tighter leading-[0.8] text-white relative">
            STREAM THE<br/>REVOLUTION
          </h1>
       </div>

       <p className="mt-12 text-stone-500 font-mono text-xs tracking-widest uppercase">
         The Signal has been intercepted.
       </p>
    </section>
  );
};

// --------------------------------------------------------
// 3. EPISODE STREAM (Living Cinema Deck)
// --------------------------------------------------------
const EpisodeStream = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null); // FIXED: Added ref for progress bar
  const bgRef = useRef(null);
  const bgImgRef = useRef(null);
  const [activeEp, setActiveEp] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const cards = gsap.utils.toArray('.ep-card');

      // 1. Horizontal Scroll & Velocity Skew
      const scrollTween = gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1, // Momentum
          start: "top top",
          end: "+=3500", // Long scroll
          
          onUpdate: (self) => {
             // Velocity Physics
             const vel = self.getVelocity();
             const skew = Math.max(-10, Math.min(10, vel / -200));
             
             // Apply Skew to Cards that aren't hovered
             cards.forEach((card) => {
                if (!card.classList.contains('hovered')) {
                    gsap.to(card, { 
                        rotateY: skew, 
                        skewX: -skew * 0.2,
                        duration: 0.2, 
                        ease: "power2.out",
                        overwrite: 'auto'
                    });
                }
             });

             // Update Progress Bar
             if(progressBarRef.current) {
                gsap.to(progressBarRef.current, { scaleX: self.progress, duration: 0.1 });
             }
          },
          onScrubComplete: () => {
             // Snap back to flat when stopped
             gsap.to(cards, { rotateY: 0, skewX: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
          }
        }
      });

      // 2. INNER PARALLAX (Window Effect)
      cards.forEach((card) => {
        const img = card.querySelector('.parallax-img');
        gsap.fromTo(img, 
          { xPercent: -20 }, 
          { 
            xPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween, 
              start: "left right", 
              end: "right left",
              scrub: true
            }
          }
        );
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Handle Dynamic Background Atmosphere
  useEffect(() => {
    if (activeEp) {
        gsap.to(bgRef.current, { backgroundColor: activeEp.theme, duration: 0.8 });
        gsap.to(bgImgRef.current, { opacity: 0.3, duration: 0.8 });
    } else {
        gsap.to(bgRef.current, { backgroundColor: '#020202', duration: 0.8 });
        gsap.to(bgImgRef.current, { opacity: 0, duration: 0.8 });
    }
  }, [activeEp]);

  const handleEnter = (e, ep) => {
     setActiveEp(ep);
     e.currentTarget.classList.add('hovered');
     
     gsap.to(e.currentTarget, { scale: 1.05, zIndex: 50, rotateY: 0, skewX: 0, duration: 0.4, ease: "back.out(1.5)" });
     // Show Play Button
     gsap.to(e.currentTarget.querySelector('.play-btn'), { opacity: 1, scale: 1, duration: 0.3 });
  };

  const handleLeave = (e) => {
     setActiveEp(null);
     e.currentTarget.classList.remove('hovered');
     gsap.to(e.currentTarget, { scale: 1, zIndex: 1, duration: 0.4 });
     // Hide Play Button
     gsap.to(e.currentTarget.querySelector('.play-btn'), { opacity: 0, scale: 0.8, duration: 0.3 });
  };

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#020202] overflow-hidden z-30 perspective-1000">
      
      {/* 0. DYNAMIC BACKGROUND (Atmosphere) */}
      <div ref={bgRef} className="absolute inset-0 z-0 bg-black transition-colors duration-1000" />
      <div className="absolute inset-0 z-0 mix-blend-overlay">
          <img 
            ref={bgImgRef} 
            src={activeEp ? activeEp.img : ''} 
            className="w-full h-full object-cover opacity-0 blur-3xl scale-125" 
            alt="Atmosphere"
          />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80" />

      {/* 1. HUD HEADER */}
      <div className="absolute top-0 left-0 w-full p-8 md:p-12 z-40 flex justify-between items-start pointer-events-none mix-blend-normal">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
            <h2 className="text-sm font-mono text-white tracking-widest uppercase border border-white/10 px-4 py-1 rounded-full backdrop-blur-md bg-black/40">
                Archived Footage /// <span className="text-white/50">Recovered</span>
            </h2>
         </div>
         <div className="font-mono text-xl md:text-2xl font-bold text-white tracking-tighter">
            FILE [ <span className="text-red-500 transition-all">{activeEp ? `0${activeEp.id}` : '--'}</span> / 04 ]
         </div>
      </div>

      {/* 2. PARALLAX TEXT BACKGROUND */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full pointer-events-none select-none z-0 opacity-10">
        <div className="bg-parallax-text whitespace-nowrap">
           <span className="text-[30vh] font-black text-transparent uppercase leading-none" style={{ WebkitTextStroke: '2px white' }}>
             SYSTEM FAILURE /// UNAUTHORIZED ACCESS /// 
           </span>
        </div>
      </div>

      {/* 3. HORIZONTAL TRACK */}
      <div ref={trackRef} className="absolute top-0 left-0 w-[400vw] h-full flex items-center pl-[15vw] z-20">
         {EPISODES.map((ep, i) => (
           <div 
             key={ep.id} 
             className="ep-card relative w-[70vw] md:w-[45vw] aspect-video mx-8 flex-shrink-0 group cursor-pointer perspective-1000"
             onMouseEnter={(e) => handleEnter(e, ep)}
             onMouseLeave={handleLeave}
           >
             
             {/* THE CARD (Window) */}
             <div 
               className="w-full h-full relative rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl transition-all duration-300"
             >
                {/* Parallax Image */}
                <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={ep.img} 
                      alt={ep.title} 
                      className="parallax-img w-[140%] h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                   <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] text-white/80 tracking-widest border border-white/20 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md">
                          {ep.time}
                        </span>
                        {/* Play Button Icon */}
                        <div className="play-btn w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <ICONS.Play />
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-white uppercase mb-2 leading-none drop-shadow-lg">{ep.title}</h3>
                      <p className="text-sm text-stone-300 font-mono max-w-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        {ep.desc}
                      </p>
                   </div>
                </div>

                {/* Glow Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-2xl transition-all duration-300" 
                     style={{ boxShadow: activeEp?.id === ep.id ? `inset 0 0 30px ${ep.theme}40` : 'none' }} />
             </div>

             {/* MASSIVE NUMBER (Behind everything) */}
             <span className="absolute -top-16 -left-12 z-[-1] pointer-events-none select-none mix-blend-overlay">
                <span className="text-[15rem] font-black text-white opacity-20 leading-none" 
                      style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
                  0{ep.id}
                </span>
             </span>

           </div>
         ))}
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
        <div ref={progressBarRef} className="h-full bg-red-600 origin-left scale-x-0" />
      </div>

    </section>
  );
};

// --------------------------------------------------------
// 4. NEW: TEAM INTRO TEXT (Typing Terminal)
// --------------------------------------------------------
const TeamIntroText = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const text = "THE PROTOCOL WAS NOT BUILT IN A DAY. FORGED IN SHADOWS BY MINDS THAT DEFY REALITY. MEET THE ARCHITECTS.";
  const [displayedText, setDisplayedText] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 60%",
        onEnter: () => {
           let i = 0;
           const interval = setInterval(() => {
             setDisplayedText(text.substring(0, i));
             i++;
             if (i > text.length) clearInterval(interval);
           }, 30);
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-[#0a0a0a] py-32 px-8 flex justify-center z-30 border-t border-white/10">
      <div className="max-w-4xl text-center">
        <h2 ref={textRef} className="text-2xl md:text-4xl font-mono text-stone-300 leading-tight">
          {displayedText}<span className="animate-pulse">_</span>
        </h2>
      </div>
    </section>
  );
};


// --------------------------------------------------------
// 5. NEW: CREATORS SECTION (Scanner Reveal Dossiers)
// --------------------------------------------------------
const CreatorsSection = () => {
  return (
    <section className="relative w-full bg-[#050505] py-24 px-4 md:px-12 z-30">
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
           <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
             The Architects
           </h2>
           <p className="font-mono text-xs text-stone-500 tracking-widest hidden md:block">
             PERSONNEL DATABASE // CLASSIFIED
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {CREATORS.map((person) => (
             <motion.div 
               key={person.id}
               className="group relative h-[80vh] w-full bg-black border border-white/10 overflow-hidden cursor-crosshair"
               whileHover={{ scale: 1.02 }}
             >
                
                {/* IMAGE LAYER */}
                <div className="absolute inset-0">
                   <img 
                     src={person.img} 
                     alt={person.name} 
                     className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" 
                   />
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                   {/* Scanline Overlay */}
                   <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />
                </div>

                {/* SCANNER LINE (CSS Animation) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_red] opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[80vh] transition-all duration-[1.5s] ease-linear" />
                
                {/* INFO (Redacted -> Revealed) */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                   <div className="flex justify-between items-end">
                      <div>
                         <div className="bg-white text-black text-xs font-mono font-bold px-2 py-1 inline-block mb-2 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            {person.clearance}
                         </div>
                         
                         {/* Redacted Name Effect */}
                         <div className="relative overflow-hidden">
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter relative z-10 group-hover:translate-y-0 transition-transform">
                               {person.name}
                            </h3>
                            <div className="absolute inset-0 bg-white z-20 group-hover:translate-x-full transition-transform duration-500 ease-in-out" />
                         </div>
                         
                         <p className="font-mono text-stone-400 text-sm mt-1 tracking-widest">{person.role}</p>
                      </div>
                      
                      <div className="text-right opacity-0 group-hover:opacity-100 transition-opacity delay-300">
                         <p className="font-mono text-[10px] text-stone-500">ID: {person.id}</p>
                         <p className="font-mono text-[10px] text-stone-500">STATUS: ACTIVE</p>
                      </div>
                   </div>
                </div>

             </motion.div>
           ))}
        </div>
      </div>

    </section>
  );
};


// --------------------------------------------------------
// 6. NEW: FOOTER CONTACT (Secure Uplink)
// --------------------------------------------------------
const FooterContact = () => {
  return (
    <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden z-30 border-t border-white/10">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      <div className="relative z-10 text-center">
         <p className="text-green-500 font-mono text-xs tracking-[0.5em] mb-8 animate-pulse">
           _SYSTEM_UPLINK_READY
         </p>
         
         <h2 className="text-[5vw] md:text-[8vw] font-black text-stone-800 uppercase tracking-tighter leading-none select-none">
           INITIATE<br/>CONTACT
         </h2>

         {/* The Big Button */}
         <div className="mt-[-2vw] relative group cursor-pointer">
            <div className="absolute inset-0 bg-red-600 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            <a href="mailto:hello@studio.com" className="relative block border-2 border-white/20 bg-black px-12 py-6 md:px-20 md:py-10 text-xl md:text-3xl font-mono text-white tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300">
               HELLO@STUDIO.COM
            </a>
         </div>

         <div className="mt-24 flex gap-8 justify-center font-mono text-xs text-stone-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
         </div>
      </div>

      <div className="absolute bottom-8 w-full text-center font-mono text-[10px] text-stone-800 uppercase tracking-[1em]">
         © 2025 // SECURE CONNECTION ESTABLISHED
      </div>

    </section>
  );
};


// --------------------------------------------------------
// (Previous components included for full file integrity)
// --------------------------------------------------------
const MarqueeBreaker = () => {
    const container = useRef(null);
    const track1 = useRef(null);
    const track2 = useRef(null);
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        gsap.to(track1.current, { xPercent: -50, repeat: -1, duration: 20, ease: "linear" });
        gsap.fromTo(track2.current, { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 20, ease: "linear" });
      }, container);
      return () => ctx.revert();
    }, []);
    const TEXT = "WARNING: SYSTEM BREACH // UNAUTHORIZED ACCESS // INITIATING LOCKDOWN // ";
    const repeatedText = TEXT.repeat(10); 
    return (
      <div ref={container} className="relative w-full bg-yellow-400 py-6 overflow-hidden z-20 border-t border-b border-black">
        <div ref={track1} className="whitespace-nowrap flex"><h2 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">{repeatedText}</h2></div>
        <div ref={track2} className="whitespace-nowrap flex mt-2"><h2 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none opacity-50">{repeatedText}</h2></div>
      </div>
    );
};
  
const Prologue = () => {
    const container = useRef(null);
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray('.prologue-line');
        lines.forEach((line) => {
          gsap.fromTo(line, { y: 50, opacity: 0, filter: "blur(10px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: line, start: "top 80%", toggleActions: "play none none reverse" }});
        });
      }, container);
      return () => ctx.revert();
    }, []);
    return (
      <section ref={container} className="relative min-h-[120vh] w-full bg-[#050505] z-20 flex flex-col items-center justify-center py-32 px-4">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png")` }} />
        <div className="max-w-4xl text-center space-y-24 md:space-y-32">
          <h2 className="prologue-line text-4xl md:text-7xl font-serif text-white leading-tight">"They promised us <span className="text-stone-500 italic">paradise</span>."</h2>
          <h2 className="prologue-line text-4xl md:text-7xl font-serif text-white leading-tight">But paradise requires <br/> <span className="text-red-600 font-bold uppercase tracking-widest text-2xl md:text-4xl block mt-4 font-sans">SACRIFICE.</span></h2>
          <div className="prologue-line"><div className="w-px h-24 bg-white/20 mx-auto mb-8" /><h3 className="text-2xl md:text-4xl font-mono text-white tracking-[0.3em] uppercase">Welcome to the Fall</h3></div>
        </div>
      </section>
    );
};

const RealityTear = () => {
    const containerRef = useRef(null);
    const utopiaRef = useRef(null);
    const dystopiaRef = useRef(null);
    const dystopiaImgRef = useRef(null);
    const vignetteRef = useRef(null);
    const laserRef = useRef(null);
    const dynamicTextRef = useRef(null);
    const dynamicSubRef = useRef(null);
    const randomChar = () => { const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&%"; return chars[Math.floor(Math.random() * chars.length)]; };
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: "top top", end: "+=300%", pin: true, scrub: 1.5 } });
        tl.to(utopiaRef.current, { clipPath: "inset(0% 100% 0% 0%)", ease: "none", duration: 1 }, 0);
        tl.to(laserRef.current, { left: "100%", ease: "none", duration: 1 }, 0);
        tl.fromTo(dystopiaImgRef.current, { scale: 1.5 }, { scale: 1.0, ease: "none", duration: 1 }, 0);
        tl.fromTo(vignetteRef.current, { opacity: 0 }, { opacity: 0.9, ease: "power2.inOut", duration: 1 }, 0);
        const scrambler = { value: 0 };
        tl.to(scrambler, { value: 1, duration: 1, ease: "none", onUpdate: () => {
            const p = scrambler.value; const el = dynamicTextRef.current; const sub = dynamicSubRef.current; if(!el || !sub) return;
            if (p < 0.45) { el.innerText = "THE PARADISE"; el.style.color = "#FFD700"; el.style.textShadow = "0 10px 20px rgba(0,0,0,0.8)"; sub.innerText = "SECTOR 00 // WEALTH"; sub.style.color = "#ffffff"; } 
            else if (p < 0.55) { el.innerText = Array(12).fill(0).map(() => randomChar()).join(""); el.style.color = "#ffffff"; el.style.textShadow = "5px 0 0 red, -5px 0 0 blue"; sub.innerText = "ERR_REALITY_FAILURE"; sub.style.color = "#ff0000"; } 
            else { el.innerText = "THE PARASITE"; el.style.color = "#FF003C"; el.style.textShadow = "0 10px 30px rgba(0,0,0,1)"; sub.innerText = "SECTOR 07 // DECAY"; sub.style.color = "#880000"; }
          } }, 0);
      }, containerRef);
      return () => ctx.revert();
    }, []);
    const handleMouseMove = (e) => { const x = (e.clientX / window.innerWidth - 0.5) * 30; const y = (e.clientY / window.innerHeight - 0.5) * 30; gsap.to(utopiaRef.current, { x: x, y: y, duration: 1, ease: "power2.out" }); gsap.to(dystopiaRef.current, { x: -x, y: -y, duration: 1, ease: "power2.out" }); };
    return (
      <div ref={containerRef} className="relative w-full h-screen z-30 overflow-hidden bg-black" onMouseMove={handleMouseMove}>
        <div ref={dystopiaRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-0 bg-black"><img ref={dystopiaImgRef} src="bg2.jpg" alt="Dystopia" className="w-full h-full object-cover origin-center" /><div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')] opacity-20 mix-blend-overlay" /><div ref={vignetteRef} className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)]" /></div>
        <div ref={utopiaRef} className="absolute inset-[-5%] w-[110%] h-[110%] z-10 bg-white" style={{ clipPath: "inset(0% 0% 0% 0%)" }}><img src="bg1.jpg" alt="Utopia" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-yellow-500/10 mix-blend-soft-light" /></div>
        <div ref={laserRef} className="absolute top-0 bottom-0 w-1 bg-white z-20 shadow-[0_0_50px_10px_rgba(255,255,255,0.8)] mix-blend-overlay" style={{ left: '0%' }}><div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-[200vh] bg-red-500/50 blur-md" /></div>
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none mix-blend-hard-light"><h2 ref={dynamicTextRef} className="text-[12vw] font-black leading-none tracking-tighter text-center will-change-transform" style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>THE PARADISE</h2><p ref={dynamicSubRef} className="font-mono text-sm tracking-[1em] bg-black/90 px-6 py-3 mt-6 uppercase border border-white/20 backdrop-blur-md shadow-2xl">SECTOR 00 // WEALTH</p></div>
      </div>
    );
};

const NarrativeManifesto = () => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const textGroupRef = useRef(null);
    const protectsRef = useRef(null);
    const ownsRef = useRef(null);
    const callRef = useRef(null);
    const lightRef = useRef(null);
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        gsap.to(textGroupRef.current, { y: 20, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: "top top", end: "+=400%", pin: true, scrub: 1.5 } });
        tl.to(bgRef.current, { backgroundColor: "#000000", duration: 2 });
        tl.to(textGroupRef.current, { color: "#ffffff", duration: 1.5 }, "<");
        tl.to(protectsRef.current, { scale: 1.5, filter: "blur(20px)", opacity: 0, duration: 2, ease: "power2.in" }, "<0.5");
        tl.fromTo(ownsRef.current, { display: 'none', scale: 0.8, opacity: 0, filter: "blur(30px)" }, { display: 'block', scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.out", textShadow: "0 0 50px rgba(255, 0, 0, 0.9)" }, "-=1.0");
        tl.to(lightRef.current, { background: 'radial-gradient(circle, rgba(255,0,0,0.5) 0%, rgba(0,0,0,0) 70%)', scale: 1.2, duration: 2 }, "<");
        tl.fromTo(callRef.current, { opacity: 0, scale: 2, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5 }, ">");
      }, containerRef);
      return () => ctx.revert();
    }, []);
    return (
      <section ref={containerRef} className="relative w-full h-screen z-20 flex items-center justify-center overflow-hidden">
        <div ref={bgRef} className="absolute inset-0 bg-[#d4d4d4] z-0" />
        <div ref={lightRef} className="absolute w-[60vw] h-[60vw] rounded-full z-10 opacity-30 pointer-events-none blur-[100px] top-[-20%] left-[-20%] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(0,0,0,0)_70%)]" />
        <div ref={textGroupRef} className="relative z-20 text-center flex flex-col items-center justify-center text-[#1a1a1a] h-full w-full">
          <h2 className="text-[4vw] font-black tracking-tight mb-8 uppercase opacity-80">THE CITY</h2>
          <div className="relative h-[20vh] w-full flex items-center justify-center"><h2 ref={protectsRef} className="absolute text-[15vw] font-black uppercase leading-none tracking-tighter">PROTECTS</h2><h2 ref={ownsRef} className="absolute text-[18vw] font-black uppercase leading-none tracking-tighter text-red-600 hidden">OWNS</h2></div>
          <h2 className="text-[4vw] font-black tracking-tight mt-8 uppercase opacity-80">YOU</h2>
        </div>
        <div ref={callRef} className="absolute bottom-24 z-30 text-center opacity-0"><h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest border-b-4 border-red-600 pb-4">Break The Cycle</h3></div>
      </section>
    );
};

const SurveillanceGrid = () => {
    const containerRef = useRef(null);
    const gridRef = useRef(null);
    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const cells = gsap.utils.toArray('.bento-cell');
        const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: "top 70%", toggleActions: "play none none reverse" } });
        tl.fromTo(cells, { scale: 0.9, opacity: 0, filter: 'grayscale(100%) blur(5px)' }, { scale: 1, opacity: 1, filter: 'grayscale(0%) blur(0px)', duration: 0.8, stagger: 0.05, ease: "power2.out" });
        gsap.to('.scanline-bg', { backgroundPosition: "0 100%", duration: 10, ease: "none", repeat: -1 });
      }, containerRef);
      return () => ctx.revert();
    }, []);
    const handleMouseMove = (e) => {
      if (!containerRef.current || !gridRef.current) return;
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const centerX = width / 2;
      const centerY = height / 2;
      const rotateX = ((y - centerY) / centerY) * -3; 
      const rotateY = ((x - centerX) / centerX) * 3;
      gsap.to(gridRef.current, { rotationX: rotateX, rotationY: rotateY, transformPerspective: 1000, ease: "power2.out", duration: 0.5 });
    };
    const resetTilt = () => { gsap.to(gridRef.current, { rotationX: 0, rotationY: 0, ease: "power2.out", duration: 0.5 }); };
    const handleHover = (e, active, color) => {
      const target = e.currentTarget;
      const video = target.querySelector('video');
      const overlay = target.querySelector('.cell-overlay');
      if (active) {
        gsap.to(target, { scale: 1.02, zIndex: 20, borderColor: '#fff', boxShadow: `0 0 30px ${color}60`, duration: 0.3 });
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
        if(video) video.playbackRate = 2.0;
      } else {
        gsap.to(target, { scale: 1, zIndex: 1, borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'none', duration: 0.3 });
        gsap.to(overlay, { opacity: 0, duration: 0.3 });
        if(video) video.playbackRate = 1.0;
      }
    };
    return (
      <section ref={containerRef} className="relative w-full min-h-screen bg-[#050505] z-30 p-4 md:p-12 border-t border-white/10 perspective-1000 overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={resetTilt}>
        <div className="absolute inset-0 scanline-bg opacity-10 pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))` }} />
        <div className="relative z-10 mb-12 flex justify-between items-end border-b border-white/20 pb-4">
          <div><h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">RESTRICTED<span className="text-red-600">ARCHIVE</span></h2><div className="flex gap-4 mt-2"><div className="flex items-center gap-2 text-[10px] font-mono text-stone-400"><ICONS.Lock /> <span>ENCRYPTION: MAX</span></div><div className="flex items-center gap-2 text-[10px] font-mono text-red-500 animate-pulse"><ICONS.Warn /> <span>UNAUTHORIZED ACCESS</span></div></div></div><div className="font-mono text-xs text-stone-600 hidden md:block">DATABASE_V.9.0.2 // SECURE CONNECTION</div>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-3 h-auto md:h-[100vh]" style={{ transformStyle: 'preserve-3d' }}>
          <div className="bento-cell col-span-1 md:col-span-2 md:row-span-2 relative bg-black border-[0.5px] border-white/20 overflow-hidden group rounded-sm min-h-[300px]" onMouseEnter={(e) => handleHover(e, true, '#ef4444')} onMouseLeave={(e) => handleHover(e, false)}>
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"><source src="elara.mov" type="video/mp4" /></video>
            <div className="cell-overlay absolute inset-0 bg-red-900/20 opacity-0 transition-opacity duration-300 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.8)] translate-y-[-100%] group-hover:animate-scan-down" />
            <div className="absolute top-4 left-4 flex gap-2"><span className="bg-red-900/50 text-red-400 text-[10px] font-mono px-2 py-1 border border-red-500/30">SUBJ: 001 // ELARA</span><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-1" /></div>
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300"><h3 className="text-3xl font-black text-white uppercase">The Spark</h3><p className="font-mono text-xs text-stone-400 mt-1">THREAT LEVEL: EXTREME</p></div>
          </div>
          <div className="bento-cell col-span-1 md:col-span-1 md:row-span-2 relative bg-black border-[0.5px] border-white/20 overflow-hidden group rounded-sm min-h-[300px]" onMouseEnter={(e) => handleHover(e, true, '#06b6d4')} onMouseLeave={(e) => handleHover(e, false)}>
            <img src="k.png" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="Kale" />
            <div className="cell-overlay absolute inset-0 bg-cyan-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-4 right-4 bg-cyan-900/50 text-cyan-400 text-[10px] font-mono px-2 py-1 border border-cyan-500/30">OFFICER KALE</div>
            <div className="absolute bottom-6 left-6 border-l-2 border-cyan-500 pl-3"><h3 className="text-xl font-bold text-white uppercase">The Shield</h3><p className="text-[10px] font-mono text-cyan-400">STATUS: ACTIVE</p></div>
          </div>
          <div className="bento-cell col-span-1 md:col-span-1 md:row-span-1 relative bg-[#0a0a0a] border-[0.5px] border-white/20 overflow-hidden group flex flex-col justify-center items-center rounded-sm min-h-[150px]" onMouseEnter={(e) => handleHover(e, true, '#eab308')} onMouseLeave={(e) => handleHover(e, false)}>
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/17/Matrix_code.gif')] bg-cover opacity-10 group-hover:opacity-30 transition-opacity" />
             <div className="cell-overlay absolute inset-0 bg-yellow-500/10 opacity-0 transition-opacity duration-300 mix-blend-overlay" />
             <div className="relative z-10 w-12 h-12 border-2 border-yellow-500/30 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500 group-hover:border-yellow-500"><ICONS.Eye /></div>
             <h3 className="relative z-10 mt-2 font-black text-white uppercase tracking-widest text-xs">MOTHER</h3>
          </div>
          <div className="bento-cell col-span-1 md:col-span-1 md:row-span-1 relative bg-[#0a0a0a] border-[0.5px] border-white/10 flex items-center justify-center group overflow-hidden rounded-sm min-h-[150px]">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#fff_1px,transparent_1px)] bg-[size:20px_20px]" />
             <div className="text-center font-mono text-[10px] text-stone-500 group-hover:text-white transition-colors">[ SECTOR MAP ENCRYPTED ]</div>
             <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 transition-all duration-300" />
          </div>
          <div className="bento-cell col-span-1 md:col-span-4 md:row-span-1 relative bg-[#080808] border-[0.5px] border-white/20 overflow-hidden group flex items-center px-8 rounded-sm min-h-[100px]">
             <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,#333_50px)]" />
             <div className="flex-1 z-10"><div className="flex items-center gap-4 mb-2"><ICONS.Activity /><span className="font-mono text-xs text-red-500 animate-pulse">RECORDING IN PROGRESS...</span></div><div className="h-8 flex items-end gap-1 w-full max-w-md">{[...Array(30)].map((_, i) => (<div key={i} className="w-1 bg-white/20 group-hover:bg-red-500 transition-colors" style={{ height: `${Math.random() * 100}%` }} />))}</div></div>
             <div className="text-right hidden md:block z-10"><h3 className="font-bold text-white text-lg">INTERROGATION_LOG_9</h3><p className="font-mono text-xs text-stone-500">FILE SIZE: 4.2TB</p></div>
          </div>
        </div>
        <style>{`@keyframes scan-down { 0% { transform: translateY(-100%); } 100% { transform: translateY(500%); } } .animate-scan-down { animation: scan-down 2s linear infinite; }`}</style>
      </section>
    );
};

// --------------------------------------------------------
// MAIN APP STRUCTURE
// --------------------------------------------------------
const Home = () => {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5 }}>
      <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
        
        {/* FONTS */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;900&family=JetBrains+Mono:wght@800&family=Playfair+Display:ital,wght@0,400;1,700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          .font-serif { font-family: 'Playfair Display', serif; }
        `}</style>

        <UIOverlay />

        <main>
          
          {/* 1. HERO */}
          <Hero />

          {/* 2. THE TRANSITION */}
          <MarqueeBreaker />

          {/* 3. THE PROLOGUE */}
          <Prologue />

          {/* 4. THE REALITY TEAR */}
          <RealityTear />

          {/* 5. THE MANIFESTO */}
          <NarrativeManifesto />

          {/* 6. THE EVIDENCE WALL */}
          <SurveillanceGrid />
          
          {/* 7. THE GATEWAY (RGB GLITCH) */}
          <SeriesInvite />
          
          {/* 8. EPISODE STREAM (TACTICAL KINETIC) */}
          <EpisodeStream />

          {/* 9. THE ARCHITECTS */}
          <TeamIntroText />
          <CreatorsSection />

          {/* 10. SECURE UPLINK */}
          <FooterContact />

        </main>

      </div>
    </ReactLenis>
  );
};

export default Home;