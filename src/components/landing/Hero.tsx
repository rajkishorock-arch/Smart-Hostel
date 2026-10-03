import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ChevronRight, Zap, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated, isWarden, quickDemoLogin } = useAuth();

  return (
    <section className="jarvis-hero" id="hero">
      <div className="jarvis-hero-stage" id="heroStage">
        {/* Sci-Fi HUD Frame (Exact jarvisapp.in HUD pinned over 3D WebGL Canvas) */}
        <div className="jarvis-hud-frame">
          <span className="jarvis-hud-corner tl" />
          <span className="jarvis-hud-corner tr" />
          <span className="jarvis-hud-corner bl" />
          <span className="jarvis-hud-corner br" />
          <div className="jarvis-hud-tag hud-tl">
            <span className="dot" />
            SYS-LINK ESTABLISHED
          </div>
          <div className="jarvis-hud-tag hud-tr" id="hudCount">
            PARTICLES • 8,200 ONLINE
          </div>
          <div className="jarvis-hud-tag hud-bl">
            SMART HOSTEL CORE • v2.6.0
          </div>
          <div className="jarvis-hud-tag hud-br" id="hudStage">
            STAGE 01 / 04
          </div>
        </div>

        {/* Stacked, cross-faded stage headlines driven by 400vh scroll (Exact jarvisapp.in flow) */}
        <div className="jarvis-hero-stages">
          {/* Stage 0: Loose Breathing Cloud (Ellipsoid) */}
          <div className="jarvis-hero-headline is-active" data-stage="0">
            <div className="jarvis-eyebrow">RESIDENTIAL OS • INITIALIZING</div>
            <h1>
              A living<br />
              <span className="accent">interface.</span>
            </h1>
            <p className="lead">
              Smart Hostel wakes on your screen — coordinating room allocations, 7-day mess nutrition, and resident telemetry the instant you log in.
            </p>
          </div>

          {/* Stage 1: Flat Orbiting Ring / Torus */}
          <div className="jarvis-hero-headline" data-stage="1">
            <div className="jarvis-eyebrow">ORBITAL CORE • ENGAGED</div>
            <h1>
              Beyond<br />
              the <span className="accent">core.</span>
            </h1>
            <p className="lead">
              An autonomous residential operating system that allocates beds, balances nutrition, and clears gate passes hands-free.
            </p>
          </div>

          {/* Stage 2: Dense Spherical Nebula */}
          <div className="jarvis-hero-headline" data-stage="2">
            <div className="jarvis-eyebrow">DISTRIBUTED COGNITION</div>
            <h1>
              Intelligence,<br />
              <span className="accent">everywhere.</span>
            </h1>
            <p className="lead">
              AI maintenance triage, real-time curfew roll-calls, and cryptographically verified digital tokens across your collegiate halls.
            </p>
          </div>

          {/* Stage 3: Clean Wireframe Globe */}
          <div className="jarvis-hero-headline" data-stage="3">
            <div className="jarvis-eyebrow">SYSTEM READY</div>
            <h1>
              Enter the<br />
              <span className="accent">future.</span>
            </h1>
            <p className="lead">
              Unified collegiate residential platform. Instant 1-click evaluation or production authentication.
            </p>
            <div className="hero-ctas">
              {isAuthenticated ? (
                <Link
                  to={isWarden ? '/admin/dashboard' : '/dashboard'}
                  className="cyber-btn-cyan"
                  style={{
                    padding: '14px 30px',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>Enter Operational Console</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => quickDemoLogin('resident')}
                    className="cyber-btn-cyan"
                    style={{
                      padding: '13px 24px',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <Zap size={16} />
                    <span>Demo Student (Rahul Sharma)</span>
                  </button>

                  <button
                    onClick={() => quickDemoLogin('warden')}
                    className="cyber-btn-outline"
                    style={{
                      padding: '13px 24px',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.92rem',
                      cursor: 'pointer'
                    }}
                  >
                    <ShieldCheck size={16} color="#00BFFB" />
                    <span>Demo Warden (Dr. Verma)</span>
                  </button>

                  <Link
                    to="/login"
                    className="cyber-btn-outline"
                    style={{
                      padding: '13px 22px',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.92rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Portal Login</span>
                    <ChevronRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="jarvis-scroll-hint" id="scrollHint">
          SCROLL TO EXPLORE <span>↓</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
