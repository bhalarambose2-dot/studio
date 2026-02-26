'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Cinematic Royal 3D Splash Loader for BR TRIP.
 * Features a zooming Earth, an orbiting airplane, and a Golden 3D Prism Logo.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Check if splash has been shown in this session
    const hasShown = sessionStorage.getItem('br-trip-cinematic-shown');
    if (hasShown) {
      setShow(false);
      return;
    }

    // Delay tagline and button fade-in for cinematic effect
    const timer = setTimeout(() => {
      setTaglineVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
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
    const pointLight = new THREE.PointLight(0xffffff, 0); // Starts at 0 for intro effect
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Earth (Cyber-Royal Wireframe Sphere)
    const earthGeometry = new THREE.SphereGeometry(2, 48, 48);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a237e,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.scale.set(0, 0, 0); // Scale starts at 0 for zoom
    scene.add(earth);

    // Planet Core Glow
    const glowGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.1 });
    const innerGlow = new THREE.Mesh(glowGeo, glowMat);
    earth.add(innerGlow);

    // Airplane (Simplified Shape)
    const planeGroup = new THREE.Group();
    const planeBodyGeom = new THREE.BoxGeometry(0.3, 0.08, 0.08);
    const planeWingGeom = new THREE.BoxGeometry(0.08, 0.04, 0.5);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const body = new THREE.Mesh(planeBodyGeom, planeMaterial);
    const wings = new THREE.Mesh(planeWingGeom, planeMaterial);
    planeGroup.add(body);
    planeGroup.add(wings);
    scene.add(planeGroup);

    // Golden Diamond Prism (Branding Core)
    const diamondGeom = new THREE.OctahedronGeometry(0.7, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 1,
      roughness: 0.2,
      flatShading: true
    });
    const logoDiamond = new THREE.Mesh(diamondGeom, diamondMat);
    logoDiamond.position.y = -3.5;
    logoDiamond.scale.set(0, 0, 0);
    scene.add(logoDiamond);

    camera.position.z = 10;

    let angle = 0;
    let introProgress = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Intro Cinematic Progress (Zooming)
      if (introProgress < 1) {
        introProgress += 0.008; // Smooth cinematic transition
        pointLight.intensity = introProgress * 2.5;
        earth.scale.set(introProgress, introProgress, introProgress);
        logoDiamond.scale.set(introProgress, introProgress, introProgress);
        camera.position.z = 10 - (introProgress * 2.5);
      }

      // Continuous Rotations
      earth.rotation.y += 0.002;
      logoDiamond.rotation.y += 0.02;

      // Orbiting Plane
      angle += 0.02;
      planeGroup.position.x = 3.5 * Math.cos(angle);
      planeGroup.position.z = 3.5 * Math.sin(angle);
      planeGroup.lookAt(earth.position);

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
    sessionStorage.setItem('br-trip-cinematic-shown', 'true');
    setShow(false);
  };

  if (!show || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden font-headline">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Cinematic Branding Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-40">
        <div className="animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black tracking-[15px] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 uppercase drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] italic">
            BR TRIP
          </h1>
        </div>

        <p className={`mt-6 text-yellow-500 font-bold tracking-[5px] uppercase text-xs md:text-sm transition-opacity duration-[2000ms] ${taglineVisible ? 'opacity-100' : 'opacity-0'}`}>
          Explore The Royal Journey ✨
        </p>

        {/* Action Button */}
        <button 
          onClick={startApp}
          className={`mt-16 px-12 py-4 text-lg font-black italic uppercase tracking-[0.2em] rounded-full bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 text-black shadow-[0_0_50px_rgba(218,165,32,0.5)] transition-all duration-[1500ms] hover:scale-110 hover:shadow-[0_0_80px_gold] active:scale-95 border-2 border-yellow-200/30 ${taglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          ENTER JOURNEY
        </button>
      </div>
    </div>
  );
}
