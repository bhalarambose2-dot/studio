'use client';

import { useState, useEffect } from 'react';

/**
 * Ultra 3D Splash Loader Component for BR TRIP.
 * Displays a rotating 3D diamond, animated background particles, and a welcome message.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
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

  if (!show) return null;

  return (
    <div className="splash-body fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <div className="diamond-container">
          <div className="diamond shadow-[0_0_40px_#00f0ff,0_0_80px_#0066ff]"></div>
        </div>
        <div className="logo-text mt-10 text-4xl font-bold tracking-[5px] text-[#00f0ff] uppercase animate-glow">
          BR TRIP
        </div>
        <div className="tagline mt-2.5 text-white tracking-[2px]">
          Travel Beyond Limits ✈
        </div>
        <button 
          onClick={startApp}
          className="btn mt-6 px-8 py-3 text-lg rounded-full border-none bg-[#00f0ff] text-black font-bold cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
        >
          Enter
        </button>
      </div>

      <style jsx>{`
        .splash-body {
          perspective: 1000px;
        }

        .splash-body::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: moveBg 20s linear infinite;
          pointer-events: none;
        }

        @keyframes moveBg {
          from { transform: translate(0, 0); }
          to { transform: translate(-200px, -200px); }
        }

        .diamond-container {
          perspective: 1000px;
          margin-bottom: 20px;
        }

        .diamond {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #00f0ff, #0066ff);
          transform: rotateX(45deg) rotateY(45deg);
          animation: rotate 6s infinite linear, float 3s ease-in-out infinite;
        }

        @keyframes rotate {
          from { transform: rotateX(45deg) rotateY(0deg); }
          to { transform: rotateX(45deg) rotateY(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateX(45deg); }
          50% { transform: translateY(-20px) rotateX(45deg); }
        }

        @keyframes glow {
          from { text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff; }
          to { text-shadow: 0 0 30px #00f0ff, 0 0 50px #0066ff; }
        }

        .animate-glow {
          animation: glow 2s infinite alternate;
        }

        .logo-text {
          text-shadow: 0 0 20px #00f0ff, 0 0 40px #0066ff;
        }
      `}</style>
    </div>
  );
}
