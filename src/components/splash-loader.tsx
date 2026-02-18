'use client';

import { Briefcase } from 'lucide-react';

export function SplashLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-30" />
      
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-primary p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(var(--primary),0.4)] animate-in zoom-in duration-1000">
            <Briefcase className="h-20 w-20 text-white" />
          </div>
        </div>

        {/* Branding & Text */}
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-7xl font-black italic tracking-tighter text-foreground flex gap-2">
            <span className="animate-in slide-in-from-left-10 duration-700">BR</span>
            <span className="text-primary animate-in slide-in-from-right-10 duration-700">TRIP</span>
          </h1>
          
          {/* Cinematic Loading Bar */}
          <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
            <div className="h-full bg-primary absolute left-0 top-0 animate-[shimmer_2s_infinite]" style={{ width: '100%' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[progress_3s_ease-in-out_infinite]" />
            </div>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.6em] text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Sahi Nivesh <span className="text-primary mx-2">•</span> Sahi Safar
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          50.1% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
