'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Splash Loader Component for BR TRIP.
 * Displays a rotating 3D wireframe globe and a welcome message.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('br-trip-splash-shown');
    if (hasShown) {
      setShow(false);
      return;
    }

    if (!mountRef.current) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create wireframe globe
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    camera.position.z = 5;

    // Animation Loop
    const animate = () => {
      if (!show) return;
      requestAnimationFrame(animate);
      globe.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [show]);

  const startApp = () => {
    sessionStorage.setItem('br-trip-splash-shown', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      {/* Three.js Canvas Container */}
      <div id="globe" ref={mountRef} className="absolute inset-0" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center text-white backdrop-blur-[15px] bg-white/10 p-10 rounded-[20px] shadow-[0_0_20px_rgba(0,255,255,0.5)] border border-white/10 animate-in fade-in zoom-in duration-700">
        <div className="logo text-5xl font-bold text-[#00e5ff] drop-shadow-[0_0_20px_#00e5ff] animate-glow">
          BR TRIP
        </div>
        <div className="tagline mt-4 text-lg tracking-[2px] font-medium">
          Book Flights • Trains • Buses
        </div>
        <button 
          onClick={startApp}
          className="btn mt-6 px-10 py-3 text-lg rounded-full border-none bg-[#00e5ff] text-[#0f2027] font-bold cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 shadow-xl shadow-cyan-500/20"
        >
          Start Journey ✈
        </button>
      </div>

      <style jsx>{`
        @keyframes glow {
          from { text-shadow: 0 0 10px #00e5ff; }
          to { text-shadow: 0 0 30px #00ffff; }
        }
        .animate-glow {
          animation: glow 2s infinite alternate;
        }
      `}</style>
    </div>
  );
}
