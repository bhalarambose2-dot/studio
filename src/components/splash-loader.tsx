'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Luxury Gold 3D Splash Loader for BR TRIP.
 * Features a rotating golden crystal geometry and premium royal typography.
 * Fixed: Hydration mismatch by ensuring component only renders after mount.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('br-trip-luxury-gold-shown');
    if (hasShown) {
      setShow(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!mounted || !show || !containerRef.current) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Royal Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffd700, 2);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Luxury Crystal Geometry (Replacing TextGeometry for stability in prototype)
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xDAA520, // Goldenrod / Luxury Gold
      metalness: 1,
      roughness: 0.1,
      emissive: 0x332200,
      flatShading: true
    });
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Wireframe Sparkle Overlay
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.2 });
    const lines = new THREE.LineSegments(wireframe, lineMat);
    crystal.add(lines);

    camera.position.z = 5;

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      crystal.rotation.y += 0.015;
      crystal.rotation.x += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [mounted, show]);

  const startApp = () => {
    sessionStorage.setItem('br-trip-luxury-gold-shown', 'true');
    setShow(false);
  };

  if (!show || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden font-headline">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Foreground Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="animate-in fade-in zoom-in duration-1000">
          <h1 className="text-7xl md:text-9xl font-black tracking-[20px] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 uppercase drop-shadow-[0_0_40px_rgba(255,215,0,0.6)] italic">
            BR TRIP
          </h1>
          <div className="mt-6 flex flex-col items-center space-y-2">
            <p className="text-yellow-500 font-bold tracking-[8px] uppercase text-sm md:text-lg">
              Explore The Royal Journey ✨
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_15px_gold]"></div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={startApp}
          className="mt-24 px-16 py-5 text-xl font-black italic uppercase tracking-[0.3em] rounded-full bg-gradient-to-r from-yellow-800 via-yellow-400 to-yellow-800 text-black shadow-[0_0_60px_rgba(218,165,32,0.6)] transition-all duration-500 hover:scale-110 hover:shadow-[0_0_100px_gold] active:scale-95 border-2 border-yellow-200/40"
        >
          ENTER KINGDOM
        </button>
      </div>
    </div>
  );
}
