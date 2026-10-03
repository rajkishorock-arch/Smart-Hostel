import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { OrbitalCoreCanvas } from '../components/common/OrbitalCoreCanvas';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Utensils,
  Wrench,
  ShieldCheck,
  QrCode,
  Clock,
  Zap,
  Lock,
  ChevronRight,
  Shield,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { quickDemoLogin } = useAuth();

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#03070e',
        color: '#e8f6fa',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Full-Page Fixed 3D Particle WebGL Canvas with 4-Stage Scroll Morph */}
      <OrbitalCoreCanvas />

      {/* 2. Sticky Glass Capsule Navbar */}
      <Navbar />

      {/* 3. 400vh Scroll-Driven Pinned 3D Hero (Exact jarvisapp.in implementation) */}
      <Hero />

      {/* 4. Cyber Ticker Marquee */}
      <div className="jarvis-marquee-wrap">
        <div className="jarvis-marquee">
          <div><span>•</span>REAL-TIME BED REGISTRY</div>
          <div><span>•</span>7-DAY MESS NUTRITION</div>
          <div><span>•</span>AI ISSUE TRIAGE &amp; DISPATCH</div>
          <div><span>•</span>DIGITAL QR GATE PASS</div>
          <div><span>•</span>10:00 PM NIGHT ROLL-CALL</div>
          <div><span>•</span>ZERO-TRUST CAMPUS SECURITY</div>
          <div><span>•</span>OFFLINE-FIRST LOCAL SYNC</div>
          <div><span>•</span>REAL-TIME BED REGISTRY</div>
          <div><span>•</span>7-DAY MESS NUTRITION</div>
          <div><span>•</span>AI ISSUE TRIAGE &amp; DISPATCH</div>
          <div><span>•</span>DIGITAL QR GATE PASS</div>
          <div><span>•</span>10:00 PM NIGHT ROLL-CALL</div>
          <div><span>•</span>ZERO-TRUST CAMPUS SECURITY</div>
        </div>
      </div>

      {/* Main Content Sections (Clean Architectural Presentation, No Dummy Clutter) */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        {/* 5. Core Capabilities Grid (Matches jarvisapp.in #features) */}
        <section id="features" style={{ padding: '100px 0' }}>
          <div className="jarvis-eyebrow">CAPABILITIES</div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              marginBottom: '16px',
              maxWidth: '780px',
              lineHeight: 1.15
            }}
          >
            Autonomous intelligence coordinating your collegiate halls.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#8aa6b3',
              maxWidth: '620px',
              lineHeight: 1.65,
              marginBottom: '32px'
            }}
          >
            Smart Hostel eliminates manual paper rosters, disjointed dining counts, and slow maintenance queues with one unified digital operating hub.
          </p>

          <div className="jarvis-features-grid">
            <div className="jarvis-feature-card">
              <div className="jarvis-feature-num">01 / SYSTEM</div>
              <Building2 size={36} color="#4fe0ff" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                Digital Room &amp; Bed Matrix
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8aa6b3', lineHeight: 1.6, margin: 0 }}>
                Instant room allotments, floor-by-floor occupancy analytics, and zero duplicate allocations with cryptographically assigned student bed tokens.
              </p>
            </div>

            <div className="jarvis-feature-card">
              <div className="jarvis-feature-num">02 / DINING</div>
              <Utensils size={36} color="#4fe0ff" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                7-Day Smart Mess Telemetry
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8aa6b3', lineHeight: 1.6, margin: 0 }}>
                Automated weekly rotating nutrition menus, real-time daily meal consumption counts, dietary allergen alerts, and kitchen grocery waste reduction.
              </p>
            </div>

            <div className="jarvis-feature-card">
              <div className="jarvis-feature-num">03 / TRIAGE</div>
              <Wrench size={36} color="#4fe0ff" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                AI Maintenance Classification
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8aa6b3', lineHeight: 1.6, margin: 0 }}>
                Resident issue reports are parsed instantly by NLP keywords to categorize trades, assign severity, and track SLA countdowns until verified resolution.
              </p>
            </div>

            <div className="jarvis-feature-card">
              <div className="jarvis-feature-num">04 / CLEARANCE</div>
              <QrCode size={36} color="#4fe0ff" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                Cryptographic QR Gate-Pass
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8aa6b3', lineHeight: 1.6, margin: 0 }}>
                Paperless outpass generation with automated guardian phone verification and instant turnstile QR scanning at campus security checkpoints.
              </p>
            </div>

            <div className="jarvis-feature-card">
              <div className="jarvis-feature-num">05 / CURFEW</div>
              <Clock size={36} color="#4fe0ff" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                Nightly 10:00 PM Roll-Call
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8aa6b3', lineHeight: 1.6, margin: 0 }}>
                Warden tablet interface for rapid floor attendance check-ins, automated absentee alerts, and real-time residential safety compliance.
              </p>
            </div>

            <div className="jarvis-feature-card">
              <div className="jarvis-feature-num">06 / SECURITY</div>
              <Lock size={36} color="#4fe0ff" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>
                Zero-Trust Role Isolation
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#8aa6b3', lineHeight: 1.6, margin: 0 }}>
                Cryptographic boundary separation between Student, Warden, Gate Security, and Campus IT Admin personas with offline-first local state caching.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Interactive Demo Terminal (Matches jarvisapp.in #demo) */}
        <section id="demo" style={{ padding: '80px 0' }}>
          <div className="jarvis-eyebrow">HOW IT OPERATES</div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.15
            }}
          >
            Autonomous Command Protocol
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#8aa6b3', maxWidth: '580px', lineHeight: 1.65 }}>
            See how the autonomous system handles residential workflows in real-time.
          </p>

          <div className="jarvis-terminal-window">
            <div className="jarvis-terminal-bar">
              <div className="jarvis-terminal-dot" />
              <div className="jarvis-terminal-dot" />
              <div className="jarvis-terminal-dot" />
              <div className="jarvis-terminal-title">smart-hostel — residential telemetry kernel</div>
            </div>
            <div className="jarvis-terminal-body">
              <div style={{ color: '#4fe0ff', marginBottom: '4px' }}>
                ▸ resident.authenticate(student_id="STU-2024-001")
              </div>
              <div style={{ color: '#8aa6b3', marginBottom: '18px', paddingLeft: '16px' }}>
                ↳ Verified: Rahul Sharma • Room 204 • Aravali Residence Hall • Bed Status: Active
              </div>

              <div style={{ color: '#4fe0ff', marginBottom: '4px' }}>
                ▸ mess.query_today_menu()
              </div>
              <div style={{ color: '#8aa6b3', marginBottom: '18px', paddingLeft: '16px' }}>
                ↳ Breakfast: Poha &amp; Sprouts (480 kcal) • Lunch: Dal Makhani &amp; Paneer (740 kcal) • Dinner: Dal Tadka (680 kcal)
              </div>

              <div style={{ color: '#4fe0ff', marginBottom: '4px' }}>
                ▸ maintenance.triage_issue(trade="Electrical", description="Ceiling fan sparking")
              </div>
              <div style={{ color: '#8aa6b3', marginBottom: '18px', paddingLeft: '16px' }}>
                ↳ AI Classifier: HIGH PRIORITY (99.2% confidence) • Ticket #TKT-101 created • Electrician assigned within 2-hour SLA
              </div>

              <div style={{ color: '#4fe0ff', marginBottom: '4px' }}>
                ▸ gatepass.request_outpass(return_by="20:00")
              </div>
              <div style={{ color: '#8aa6b3', paddingLeft: '16px' }}>
                ↳ Guardian SMS dispatched to verified parent contact • Digital QR token signed for Gate Security
              </div>
            </div>
          </div>

          {/* Privacy & Speed Telemetry Strip */}
          <div className="jarvis-privacy-strip">
            <div className="jarvis-privacy-item">
              <div className="num">&lt;1s</div>
              <div className="lbl">Turnstile QR scan speed for gate clearance</div>
            </div>
            <div className="jarvis-privacy-item">
              <div className="num">100%</div>
              <div className="lbl">Local storage sync for zero offline downtime</div>
            </div>
            <div className="jarvis-privacy-item">
              <div className="num">99.2%</div>
              <div className="lbl">AI triage accuracy for maintenance dispatch</div>
            </div>
            <div className="jarvis-privacy-item">
              <div className="num">4 Personas</div>
              <div className="lbl">Resident, Warden, Guard, Admin role isolation</div>
            </div>
          </div>
        </section>

        {/* 7. Fast 1-Click Evaluation Action Section */}
        <section id="launch" style={{ padding: '80px 0 120px 0' }}>
          <div
            className="hud-frame"
            style={{
              padding: '48px 36px',
              background: 'rgba(8, 14, 28, 0.75)',
              border: '1px solid rgba(79, 224, 255, 0.35)',
              boxShadow: '0 0 50px rgba(79, 224, 255, 0.15)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div className="hud-corner tl" />
            <div className="hud-corner tr" />
            <div className="hud-corner bl" />
            <div className="hud-corner br" />

            <div className="jarvis-eyebrow">INSTANT DEMO EVALUATION</div>

            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px'
              }}
            >
              Ready to Test Smart Hostel OS?
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#8aa6b3',
                maxWidth: '620px',
                margin: '0 auto 32px auto',
                lineHeight: 1.6
              }}
            >
              Click any authorized persona below to instantly launch their real operational dashboard, or sign in with your credentials.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px'
              }}
            >
              <button
                onClick={() => quickDemoLogin('resident')}
                className="cyber-btn-cyan"
                style={{
                  padding: '13px 26px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none'
                }}
              >
                <Users size={16} />
                <span>Launch Student Dashboard (Rahul Sharma)</span>
              </button>

              <button
                onClick={() => quickDemoLogin('warden')}
                className="cyber-btn-outline"
                style={{
                  padding: '13px 26px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={16} color="#4fe0ff" />
                <span>Launch Warden Desk (Dr. R. K. Verma)</span>
              </button>

              <Link
                to="/login"
                className="cyber-btn-outline"
                style={{
                  padding: '13px 24px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none'
                }}
              >
                <span>Portal Login</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Sleek Dark Glass Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
