'use client';

import { useState, useEffect } from 'react';

/**
 * Ultra 3D Premium Splash Loader for BR TRIP.
 * Features a multifaceted 3D diamond, neon glow effects, and a futuristic particle background.
 * Fixed: Hydration mismatch by ensuring random values are generated only on client.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('br-trip-splash-shown');
    if (hasShown) {
      setShow(false);
      return;
    }
  }, []);

  const startApp = () => {
    sessionStorage.setItem('br-trip-splash-shown', 'true');
    setShow(false);
  };

  if (!show || !mounted) return null;

  return (
    <div className="splash-body fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#00050a]">
      {/* Dynamic Background Particles */}
      <div className="particles-container absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`} />
        ))}
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        {/* The 3D Diamond / Best Logo */}
        <div className="diamond-wrapper">
          <div className="diamond-3d">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
          <div className="diamond-shadow"></div>
        </div>

        {/* Branding */}
        <div className="branding mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <h1 className="logo-text text-5xl md:text-7xl font-black tracking-[10px] italic text-[#00f0ff] uppercase">
            BR TRIP
          </h1>
          <div className="tagline-wrapper mt-4">
            <p className="tagline text-white/80 font-bold tracking-[4px] uppercase text-xs md:text-sm">
              Travel Beyond Limits ✈
            </p>
            <div className="tagline-underline h-0.5 w-12 bg-[#00f0ff] mx-auto mt-2 shadow-[0_0_10px_#00f0ff]"></div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={startApp}
          className="enter-btn mt-12 px-12 py-4 text-lg font-black italic uppercase tracking-widest rounded-full bg-[#00f0ff] text-black shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-500 hover:bg-white hover:scale-110 hover:shadow-[0_0_50px_#00f0ff] active:scale-95 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700"
        >
          Enter Journey
        </button>
      </div>

      <style jsx>{`
        .splash-body {
          perspective: 2000px;
        }

        /* 3D Diamond Construction */
        .diamond-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          transform-style: preserve-3d;
        }

        .diamond-3d {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate-3d 8s infinite linear;
        }

        .face {
          position: absolute;
          width: 100px;
          height: 100px;
          left: 50px;
          top: 50px;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.5);
          box-shadow: inset 0 0 20px rgba(0, 240, 255, 0.2);
          backdrop-filter: blur(2px);
        }

        .front  { transform: rotateY(0deg) translateZ(50px); }
        .back   { transform: rotateY(180deg) translateZ(50px); }
        .right  { transform: rotateY(90deg) translateZ(50px); }
        .left   { transform: rotateY(-90deg) translateZ(50px); }
        .top    { transform: rotateX(90deg) translateZ(50px); }
        .bottom { transform: rotateX(-90deg) translateZ(50px); }

        /* Diamond Prism Effect */
        .diamond-3d::before, .diamond-3d::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-left: 50px solid transparent;
          border-right: 50px solid transparent;
          left: 50px;
        }

        .diamond-3d::before {
          border-bottom: 80px solid rgba(0, 240, 255, 0.4);
          top: -30px;
          transform: translateZ(0) rotateX(15deg);
        }

        .diamond-3d::after {
          border-top: 80px solid rgba(0, 102, 255, 0.4);
          bottom: -30px;
          transform: translateZ(0) rotateX(-15deg);
        }

        @keyframes rotate-3d {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }

        .diamond-shadow {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 20px;
          background: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(10px);
          animation: shadow-pulse 3s ease-in-out infinite;
        }

        @keyframes shadow-pulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scale(1.2); opacity: 0.5; }
        }

        /* Branding Glow */
        .logo-text {
          text-shadow: 0 0 20px #00f0ff, 0 0 40px #0066ff;
          animation: logo-glow 2s infinite alternate;
        }

        @keyframes logo-glow {
          from { text-shadow: 0 0 15px #00f0ff, 0 0 30px #0066ff; opacity: 0.8; }
          to { text-shadow: 0 0 30px #00f0ff, 0 0 60px #00ffff; opacity: 1; }
        }

        /* Particle Stars */
        .particle {
          position: absolute;
          background: #00f0ff;
          border-radius: 50%;
          opacity: 0.3;
          pointer-events: none;
        }

        ${[...Array(20)].map((_, i) => `
          .particle-${i} {
            width: ${Math.floor(Math.random() * 4) + 2}px;
            height: ${Math.floor(Math.random() * 4) + 2}px;
            left: ${Math.floor(Math.random() * 100)}%;
            top: ${Math.floor(Math.random() * 100)}%;
            animation: particle-move-${i} ${Math.floor(Math.random() * 10) + 10}s infinite linear;
          }
          @keyframes particle-move-${i} {
            0% { transform: translate(0, 0); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translate(${Math.floor(Math.random() * 200) - 100}px, ${Math.floor(Math.random() * 200) - 100}px); opacity: 0; }
          }
        `).join('')}

      `}</style>
    </div>
  );
}
