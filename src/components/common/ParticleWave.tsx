import React, { useEffect, useRef } from 'react';

interface ParticleWaveProps {
  particleColor?: string;
  shadowColor?: string;
  opacity?: number;
  className?: string;
}

export const ParticleWave: React.FC<ParticleWaveProps> = ({
  particleColor = 'rgba(0, 191, 251,',
  shadowColor = '#00BFFB',
  opacity = 0.75,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const SEPARATION = 42;
    const AMOUNTX = 48;
    const AMOUNTY = 36;
    let count = 0;

    const render = () => {
      // Trail effect with deep void dark
      ctx.fillStyle = 'rgba(3, 7, 18, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const fov = 320;
      const cameraY = 220;
      const cameraZ = 340;

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = (ix - AMOUNTX / 2) * SEPARATION;
          const z = (iy - AMOUNTY / 2) * SEPARATION;
          // Undulating double-sine 3D wave matching Jarvis & GEC IoT
          const y = Math.sin((ix + count) * 0.3) * 45 + Math.sin((iy + count) * 0.5) * 45;

          const rotX = x;
          const rotY = y - cameraY;
          const rotZ = z + cameraZ;

          if (rotZ > 0) {
            const scale = fov / rotZ;
            const projX = width / 2 + rotX * scale;
            const projY = height / 2 + rotY * scale;

            if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
              const alpha = Math.min(Math.max((rotZ - 80) / 780, 0.12), 0.95);
              ctx.beginPath();
              ctx.arc(projX, projY, Math.max(1.1 * scale, 0.6), 0, Math.PI * 2);
              ctx.fillStyle = `${particleColor} ${alpha})`;
              ctx.shadowBlur = Math.min(10 * scale, 16);
              ctx.shadowColor = shadowColor;
              ctx.fill();
            }
          }
        }
      }

      count += 0.045;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, shadowColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticleWave;
