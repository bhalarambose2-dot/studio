'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Cinematic Night Sky Splash Loader for HALORA.
 * Features a moon, twinkling stars, a flying plane, and a jumping location pin.
 * Based on the user's custom HTML/CSS design.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<{ left: string; top: string; delay: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    const hasShown = sessionStorage.getItem('halora-splash-shown');
    if (hasShown) {
      setShow(false);
      return;
    }

    // Generate stars on mount to avoid hydration mismatch
    const newStars = Array.from({ length: 150 }).map(() => ({
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      delay: `${Math.random() * 2}s`,
    }));
    setStars(newStars);
  }, []);

  const startApp = () => {
    sessionStorage.setItem('halora-splash-shown', 'true');
    setShow(false);
  };

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[radial-gradient(circle_at_bottom,#0d1b2a,#000)] overflow-hidden font-sans select-none">
      {/* Twinkling Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-[2px] height-[2px] bg-white rounded-full animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay,
            opacity: 0.5,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute top-20 right-10 md:right-40 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-[0_0_80px_rgba(255,255,255,0.8)]" />

      {/* Flying Plane */}
      <div className="absolute top-[40%] text-4xl md:text-5xl animate-fly">
        ✈️
      </div>

      {/* Jumping Pin */}
      <div className="absolute bottom-[180px] left-1/2 -translate-x-1/2 text-4xl md:text-5xl animate-jump">
        📍
      </div>

      {/* Title & Entry Button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-6 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-2xl">
            Welcome To <br />
            <span className="text-primary-foreground bg-primary px-6 py-2 rounded-3xl">HALORA</span>
          </h1>
          <p className="text-white/60 font-bold tracking-[0.3em] uppercase text-xs md:text-sm italic">
            Sahi Safar • Sahi Nivesh
          </p>
          
          <div className="pt-10">
            <button 
              onClick={startApp}
              className="px-12 py-4 text-lg font-black italic uppercase tracking-[0.2em] rounded-full bg-white text-primary shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all hover:scale-110 active:scale-95 border-none"
            >
              START JOURNEY
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
        @keyframes fly {
          from { left: -200px; }
          to { left: 110%; }
        }
        @keyframes jump {
          0% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -30px); }
          100% { transform: translate(-50%, 0); }
        }
        .animate-twinkle {
          animation: twinkle 2s infinite alternate;
        }
        .animate-fly {
          animation: fly 12s linear infinite;
        }
        .animate-jump {
          animation: jump 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
