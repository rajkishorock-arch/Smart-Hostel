import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OrbitalCoreCanvasProps {
  className?: string;
}

export const OrbitalCoreCanvas: React.FC<OrbitalCoreCanvasProps> = ({
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.matchMedia('(max-width: 900px)').matches || ('ontouchstart' in window);
    const N = isMobile ? 3000 : 8200;
    const BG = 0x03070e;
    const TAU = Math.PI * 2;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let running = true;
    let p = 0;
    let pSmooth = 0;
    let curStage = -1;
    let animationId: number;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL init error:', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.045);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const clock = new THREE.Clock();
    const group = new THREE.Group();
    scene.add(group);

    // Glowing sprite texture from Jarvis
    function glowTexture() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const x = c.getContext('2d');
      if (!x) return new THREE.Texture();
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(180,244,255,0.85)');
      g.addColorStop(0.6, 'rgba(79,224,255,0.25)');
      g.addColorStop(1, 'rgba(79,224,255,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    // Precompute 4 shape targets from Jarvis math
    const T = [
      new Float32Array(N * 3), // Stage 0: Cloud
      new Float32Array(N * 3), // Stage 1: Torus Ring
      new Float32Array(N * 3), // Stage 2: Spherical Nebula
      new Float32Array(N * 3)  // Stage 3: Wireframe Globe
    ];
    const colors = new Float32Array(N * 3);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    const cyan = [0.31, 0.88, 1.0];
    const violet = [0.56, 0.42, 1.0];
    const LAT = 13, LON = 22, R_GLOBE = 2.5;

    for (let i = 0; i < N; i++) {
      const o = i * 3;

      // Stage 0: loose breathing cloud (ellipsoid)
      T[0][o]   = gauss() * 2.9;
      T[0][o+1] = gauss() * 1.85;
      T[0][o+2] = gauss() * 1.85;

      // Stage 1: flat orbiting ring / torus (in XZ plane)
      const a = Math.random() * TAU, b = Math.random() * TAU, Rr = 2.75, rr = 0.42;
      T[1][o]   = (Rr + rr * Math.cos(b)) * Math.cos(a);
      T[1][o+1] = rr * Math.sin(b);
      T[1][o+2] = (Rr + rr * Math.cos(b)) * Math.sin(a);

      // Stage 2: dense spherical nebula
      const rad = 3.3 * Math.pow(Math.random(), 0.62);
      const th = Math.acos(2 * Math.random() - 1), ph = Math.random() * TAU;
      T[2][o]   = rad * Math.sin(th) * Math.cos(ph);
      T[2][o+1] = rad * Math.sin(th) * Math.sin(ph) * 0.92;
      T[2][o+2] = rad * Math.cos(th);

      // Stage 3: clean wireframe globe
      let lat, lon;
      if (i % 2 === 0) {
        lat = ((i % LAT) / (LAT - 1) - 0.5) * Math.PI;
        lon = Math.random() * TAU;
      } else {
        lon = ((i % LON) / LON) * TAU;
        lat = (Math.random() - 0.5) * Math.PI;
      }
      T[3][o]   = R_GLOBE * Math.cos(lat) * Math.cos(lon);
      T[3][o+1] = R_GLOBE * Math.sin(lat);
      T[3][o+2] = R_GLOBE * Math.cos(lat) * Math.sin(lon);

      // Color variation: electric cyan primary, subtle violet core
      const m = Math.random() < 0.28 ? Math.random() * 0.9 : Math.random() * 0.18;
      colors[o]   = cyan[0] + (violet[0] - cyan[0]) * m;
      colors[o+1] = cyan[1] + (violet[1] - cyan[1]) * m;
      colors[o+2] = cyan[2] + (violet[2] - cyan[2]) * m;
    }

    const disp = new Float32Array(T[0]); // Starts at stage 0 (cloud)
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(disp, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pmat = new THREE.PointsMaterial({
      size: isMobile ? 0.075 : 0.055,
      map: glowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geo, pmat);
    group.add(points);

    // Event listeners
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

    const handleVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.getDelta();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Scroll reading logic from Jarvis
    const MORPH_END = 0.86;
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const readScroll = () => {
      const hero = document.getElementById('hero');
      const stage = document.getElementById('heroStage');
      const hint = document.getElementById('scrollHint');
      if (!hero || !stage) return;
      const denom = Math.max(1, hero.offsetHeight - window.innerHeight);
      const top = hero.getBoundingClientRect().top;
      p = Math.max(0, Math.min(1, -top / denom));

      const past = window.scrollY - denom;
      stage.classList.toggle('done', past > 2);
      if (pmat) {
        pmat.opacity = Math.max(0.18, Math.min(1, 1 - past / (window.innerHeight * 0.75)));
      }
      if (hint) {
        hint.style.opacity = p > 0.04 ? '0' : '0.7';
      }
    };

    window.addEventListener('scroll', readScroll, { passive: true });
    readScroll();

    const setStage = (idx: number) => {
      if (idx === curStage) return;
      curStage = idx;
      const hList = document.querySelectorAll<HTMLElement>('.jarvis-hero-headline');
      hList.forEach((h, k) => h.classList.toggle('is-active', k === idx));
      const hud = document.getElementById('hudStage');
      if (hud) hud.textContent = 'STAGE 0' + (idx + 1) + ' / 04';
    };

    const animate = () => {
      if (!running) return;
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      pSmooth += (p - pSmooth) * 0.10;

      const mp = Math.min(1, pSmooth / MORPH_END);
      const seg = mp * 3;
      const si = Math.min(2, Math.floor(seg));
      const lf = smooth(seg - si);
      const A = T[si];
      const B = T[si + 1];

      // Stage 0 breathes
      const bf = si === 0 ? 1 + 0.06 * Math.sin(t * 0.9) * (1 - lf) : 1;

      for (let i = 0; i < N; i++) {
        const o = i * 3;
        const ax = A[o] * bf;
        const ay = A[o + 1] * bf;
        const az = A[o + 2] * bf;
        const tx = ax + (B[o] - ax) * lf;
        const ty = ay + (B[o + 1] - ay) * lf;
        const tz = az + (B[o + 2] - az) * lf;
        disp[o] += (tx - disp[o]) * 0.14;
        disp[o + 1] += (ty - disp[o + 1]) * 0.14;
        disp[o + 2] += (tz - disp[o + 2]) * 0.14;
      }
      geo.attributes.position.needsUpdate = true;

      setStage(Math.max(0, Math.min(3, Math.round(mp * 3))));

      const ringFactor = Math.max(0, 1 - Math.abs(mp - 0.33) * 3);
      group.rotation.y = t * 0.06 + mouse.x * 0.45;
      group.rotation.x = -0.15 - 0.5 * ringFactor + mouse.y * 0.25;
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    setStage(0);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', readScroll);
      geo.dispose();
      pmat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        className="aurora"
        style={{
          position: 'fixed',
          inset: '-25%',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(75px)',
          opacity: 0.55,
          background: `
            radial-gradient(38% 38% at 22% 28%, rgba(79, 224, 255, 0.16), transparent 62%),
            radial-gradient(34% 34% at 82% 18%, rgba(138, 108, 255, 0.13), transparent 60%),
            radial-gradient(46% 46% at 62% 82%, rgba(79, 224, 255, 0.10), transparent 62%)
          `
        }}
      />
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
      <div
        className="grid-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(79, 224, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 224, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)'
        }}
      />
    </>
  );
};

export default OrbitalCoreCanvas;
