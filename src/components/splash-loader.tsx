'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Ultimate Royal 3D Splash Loader for BR TRIP.
 * Features a rotating Earth, an orbiting airplane, and 3D Golden Logo.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('br-trip-royal-shown');
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x2233ff,
      wireframe: true, // Wireframe for futuristic royal look
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Airplane (Simplified Shape for Prototype Stability)
    const planeGroup = new THREE.Group();
    const planeBodyGeom = new THREE.BoxGeometry(0.4, 0.1, 0.1);
    const planeWingGeom = new THREE.BoxGeometry(0.1, 0.05, 0.6);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const body = new THREE.Mesh(planeBodyGeom, planeMaterial);
    const wings = new THREE.Mesh(planeWingGeom, planeMaterial);
    planeGroup.add(body);
    planeGroup.add(wings);
    scene.add(planeGroup);

    // Golden Diamond (Representing the Logo core in 3D)
    const diamondGeom = new THREE.OctahedronGeometry(0.8, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 1,
      roughness: 0.2,
      flatShading: true
    });
    const diamond = new THREE.Mesh(diamondGeom, diamondMat);
    diamond.position.y = -3.5;
    scene.add(diamond);

    camera.position.z = 8;

    let angle = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate Earth
      earth.rotation.y += 0.005;

      // Orbit Plane
      angle += 0.02;
      planeGroup.position.x = 3.5 * Math.cos(angle);
      planeGroup.position.z = 3.5 * Math.sin(angle);
      planeGroup.rotation.y = -angle; // Make plane look forward

      // Rotate Diamond
      diamond.rotation.y += 0.02;

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
    sessionStorage.setItem('br-trip-royal-shown', 'true');
    setShow(false);
  };

  if (!show || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden font-headline">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Foreground Branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-40">
        <div className="animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black tracking-[15px] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 uppercase drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] italic">
            BR TRIP
          </h1>
          <p className="text-yellow-500 font-bold tracking-[5px] uppercase text-xs md:text-sm mt-4">
            Book Flights • Trains • Buses ✨
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={startApp}
          className="mt-20 px-12 py-4 text-lg font-black italic uppercase tracking-[0.2em] rounded-full bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 text-black shadow-[0_0_50px_rgba(218,165,32,0.5)] transition-all duration-500 hover:scale-110 hover:shadow-[0_0_80px_gold] active:scale-95 border-2 border-yellow-200/30"
        >
          ENTER JOURNEY
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .container {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
