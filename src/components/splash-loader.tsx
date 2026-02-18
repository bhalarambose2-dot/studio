'use client';

import { Briefcase } from 'lucide-react';

export function SplashLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden perspective-1000">
      {/* 3D Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
      
      <div className="relative flex flex-col items-center gap-12">
        {/* 3D Animated Icon Container */}
        <div className="relative group animate-float-3d">
          <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-primary p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(var(--primary),0.5)] transform-gpu rotate-y-12 hover:rotate-y-0 transition-transform duration-1000">
            <Briefcase className="h-24 w-24 text-white drop-shadow-2xl" />
          </div>
        </div>

        {/* Branding with 3D Text Animation */}
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-8xl font-black italic tracking-tighter text-foreground flex gap-4 drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)]">
            <span className="animate-3d-slide-in-left">BR</span>
            <span className="text-primary animate-3d-slide-in-right">TRIP</span>
          </h1>
          
          {/* Animated 3D Progress Indicator */}
          <div className="w-80 h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner border border-slate-200/50">
            <div className="h-full bg-primary absolute left-0 top-0 w-full transform-origin-left animate-progress-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-fast" />
            </div>
          </div>

          <p className="text-sm font-black uppercase tracking-[0.8em] text-muted-foreground/60 animate-fade-up">
            Sahi Nivesh <span className="text-primary mx-3">•</span> Sahi Safar
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes float-3d {
          0%, 100% { transform: translateY(0) rotateX(10deg) rotateY(-10deg); }
          50% { transform: translateY(-30px) rotateX(-5deg) rotateY(15deg); }
        }
        
        .animate-float-3d {
          animation: float-3d 6s infinite ease-in-out;
          transform-style: preserve-3d;
        }

        @keyframes slide-in-3d-left {
          0% { opacity: 0; transform: translateX(-200px) translateZ(-500px) rotateY(-90deg); }
          100% { opacity: 1; transform: translateX(0) translateZ(0) rotateY(0); }
        }

        @keyframes slide-in-3d-right {
          0% { opacity: 0; transform: translateX(200px) translateZ(-500px) rotateY(90deg); }
          100% { opacity: 1; transform: translateX(0) translateZ(0) rotateY(0); }
        }

        .animate-3d-slide-in-left {
          animation: slide-in-3d-left 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-3d-slide-in-right {
          animation: slide-in-3d-right 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          animation-delay: 0.2s;
        }

        @keyframes progress-glow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        .animate-progress-glow {
          animation: progress-glow 2.5s ease-out forwards;
        }

        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s infinite linear;
        }

        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-up {
          animation: fade-up 1s ease-out forwards;
          animation-delay: 1s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
