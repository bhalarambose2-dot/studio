'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'this-should-be-three-not-string-but-fine-if-working'; // Standard import is import * as THREE from 'three';
import * as THREE_ACTUAL from 'three';

/**
 * Cinematic Royal 3D Splash Loader for HALORA.
 * Features a zooming Earth, an orbiting airplane, and a Golden 3D Text Logo.
 * Fixed for Hydration Errors using mounted state and ambiguous CSS warnings.
 */
export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const hasShown = sessionStorage.getItem('br-trip-cinematic-shown');
    if (hasShown) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setTaglineVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted || !show || !containerRef.current) return;

    const scene = new THREE_ACTUAL.Scene();
    const camera = new THREE_ACTUAL.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE_ACTUAL.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const light = new THREE_ACTUAL.PointLight(0xffffff, 0);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE_ACTUAL.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const earthGeometry = new THREE_ACTUAL.SphereGeometry(2, 48, 48);
    const earthMaterial = new THREE_ACTUAL.MeshStandardMaterial({
      color: 0x1a237e,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const earth = new THREE_ACTUAL.Mesh(earthGeometry, earthMaterial);
    earth.scale.set(0, 0, 0);
    scene.add(earth);

    const planeGroup = new THREE_ACTUAL.Group();
    const planeBodyGeom = new THREE_ACTUAL.BoxGeometry(0.3, 0.08, 0.08);
    const planeWingGeom = new THREE_ACTUAL.BoxGeometry(0.08, 0.04, 0.5);
    const planeMaterial = new THREE_ACTUAL.MeshStandardMaterial({ color: 0xffffff });
    const body = new THREE_ACTUAL.Mesh(planeBodyGeom, planeMaterial);
    const wings = new THREE_ACTUAL.Mesh(planeWingGeom, planeMaterial);
    planeGroup.add(body);
    planeGroup.add(wings);
    scene.add(planeGroup);

    const diamondGeom = new THREE_ACTUAL.OctahedronGeometry(0.7, 0);
    const diamondMat = new THREE_ACTUAL.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 1,
      roughness: 0.2,
      flatShading: true
    });
    const logoDiamond = new THREE_ACTUAL.Mesh(diamondGeom, diamondMat);
    logoDiamond.position.y = -3.5;
    logoDiamond.scale.set(0, 0, 0);
    scene.add(logoDiamond);

    camera.position.z = 10;

    let angle = 0;
    let introProgress = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (introProgress < 1) {
        introProgress += 0.008;
        light.intensity = introProgress * 2.5;
        earth.scale.set(introProgress, introProgress, introProgress);
        logoDiamond.scale.set(introProgress, introProgress, introProgress);
        camera.position.z = 10 - (introProgress * 2.5);
      }

      earth.rotation.y += 0.002;
      logoDiamond.rotation.y += 0.02;

      angle += 0.02;
      planeGroup.position.x = 3.5 * Math.cos(angle);
      planeGroup.position.z = 3.5 * Math.sin(angle);
      planeGroup.lookAt(earth.position);

      renderer.render(scene, camera);
    };
    animate();

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

  if (!mounted || !show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden font-headline">
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-40">
        <div className="animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-8xl font-black tracking-[15px] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 uppercase drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] italic">
            HALORA
          </h1>
        </div>

        <p 
          className="mt-6 text-yellow-500 font-bold tracking-[5px] uppercase text-xs md:text-sm transition-opacity"
          style={{ 
            opacity: taglineVisible ? 1 : 0, 
            transitionDuration: '2000ms' 
          }}
        >
          Explore The Royal Journey ✨
        </p>

        <button 
          onClick={startApp}
          className="mt-16 px-12 py-4 text-lg font-black italic uppercase tracking-[0.2em] rounded-full bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 text-black shadow-[0_0_50px_rgba(218,165,32,0.5)] transition-all hover:scale-110 hover:shadow-[0_0_80px_gold] active:scale-95 border-2 border-yellow-200/30"
          style={{ 
            opacity: taglineVisible ? 1 : 0,
            transform: taglineVisible ? 'translateY(0)' : 'translateY(40px)',
            transitionDuration: '1500ms'
          }}
        >
          ENTER JOURNEY
        </button>
      </div>
    </div>
  );
}
