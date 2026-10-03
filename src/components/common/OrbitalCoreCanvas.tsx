import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OrbitalCoreCanvasProps {
  className?: string;
  showFullPage?: boolean;
}

export const OrbitalCoreCanvas: React.FC<OrbitalCoreCanvasProps> = ({
  className = '',
  showFullPage = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const N = isMobile ? 3500 : 8200;
    const BG = 0x03070e;
    const TAU = Math.PI * 2;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let animationId: number;
    let running = true;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL initialization error:', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.045);

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const clock = new THREE.Clock();
    const group = new THREE.Group();
    scene.add(group);

    // Glow sprite texture (Exact match to Jarvis glowing points)
    const createGlowTexture = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.Texture();
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.25, 'rgba(180, 244, 255, 0.9)');
      g.addColorStop(0.6, 'rgba(0, 191, 251, 0.35)');
      g.addColorStop(1, 'rgba(0, 191, 251, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    };

    // Precompute Torus / Ring shape targets from Jarvis math
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const cyan = [0.0, 0.75, 1.0]; // #00BFFB
    const violet = [0.55, 0.42, 1.0]; // #8B6CFF

    // Geometry parameters for the Torus (Orbital Core)
    const Rr = 2.85; // Major radius of torus
    const rr = 0.52; // Minor tube radius of torus

    for (let i = 0; i < N; i++) {
      const o = i * 3;
      const a = Math.random() * TAU; // Angle around the main ring
      const b = Math.random() * TAU; // Angle around the tube

      // 3D Torus parametric equation (horizontal X-Z plane with Y elevation)
      // Small jitter added for natural volumetric particle field
      const jitter = (Math.random() - 0.5) * 0.12;
      positions[o] = (Rr + (rr + jitter) * Math.cos(b)) * Math.cos(a);
      positions[o + 1] = (rr + jitter) * Math.sin(b);
      positions[o + 2] = (Rr + (rr + jitter) * Math.cos(b)) * Math.sin(a);

      // Color variation: electric cyan primary, subtle violet core
      const m = Math.random() < 0.25 ? Math.random() * 0.85 : Math.random() * 0.15;
      colors[o] = cyan[0] + (violet[0] - cyan[0]) * m;
      colors[o + 1] = cyan[1] + (violet[1] - cyan[1]) * m;
      colors[o + 2] = cyan[2] + (violet[2] - cyan[2]) * m;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.075 : 0.058,
      map: createGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    // Initial 3D tilt: Tilted forward ~32 degrees to show the orbital torus ring
    group.rotation.x = -0.62;

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse Parallax Handler
    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Visibility change
    const handleVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.getDelta();
        render();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Animation Loop
    const render = () => {
      if (!running) return;
      const t = clock.getElapsedTime();

      // Smooth mouse easing
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Rotate torus around its vertical axis with continuous 3D orbiting
      group.rotation.y = t * 0.14 + mouse.x * 0.35;
      // Slight responsive tilt with mouse motion
      group.rotation.x = -0.62 + mouse.y * 0.2;
      group.rotation.z = Math.sin(t * 0.2) * 0.04;

      // Camera gentle floating
      camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* 1. Deep Aurora Glow Layer (Jarvis Exact Aurora Gradient) */}
      <div
        className="aurora-layer"
        style={{
          position: 'fixed',
          inset: '-20%',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(75px)',
          opacity: 0.55,
          background: `
            radial-gradient(40% 40% at 20% 30%, rgba(0, 191, 251, 0.18), transparent 65%),
            radial-gradient(35% 35% at 80% 20%, rgba(138, 108, 255, 0.14), transparent 60%),
            radial-gradient(45% 45% at 60% 80%, rgba(0, 191, 251, 0.12), transparent 65%)
          `
        }}
      />

      {/* 2. Full-Page Fixed Three.js WebGL Particle Canvas */}
      <canvas
        ref={canvasRef}
        id="bg-canvas"
        className={className}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Cyberpunk Grid Line Overlay */}
      <div
        className="grid-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(0, 191, 251, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 251, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 95%)'
        }}
      />
    </>
  );
};

export default OrbitalCoreCanvas;
