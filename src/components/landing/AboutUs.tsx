import React from 'react';
import {
  ShieldAlert,
  Award,
  Users2,
  CheckCircle,
  Building2,
  Heart
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" style={{ padding: '80px 0', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Mission & Architecture */}
          <div>
            <span
              style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#4f46e5',
                letterSpacing: '0.08em'
              }}
            >
              System Overview &amp; Architecture
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px',
                marginBottom: '20px'
              }}
            >
              Modernizing Campus Residential &amp; Mess Operations
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Hostels form the backbone of collegiate student life. Traditional residence management often
              relies on fragmented paper complaint logs, uncoordinated meal menus, and opaque maintenance routing.
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              <strong>Smart Hostel</strong> delivers a unified digital administration architecture:
              centralized room and bed inventory, a live 7-day dining schedule editor, and automatic AI-assisted
              classification for electrical, plumbing, and carpentry maintenance requests.
            </p>

            {/* Core Architectural Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  Target Response: Priority-Driven Rapid Maintenance Routing
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  Transparent Dining: Live Real-Time Weekly Meal Schedules
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  Role-Protected Architecture: Enforced via Cloud Firestore Security Rules
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Specifications */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
              borderRadius: '24px',
              padding: '40px 32px',
              color: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <Building2 size={32} color="#818cf8" />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  Hostel Management Network
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                  Product Architecture Specifications
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                marginBottom: '32px'
              }}
            >
              <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                  1,000+
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Designed Resident Capacity</div>
              </div>

              <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>
                  24h
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Target Maintenance SLA</div>
              </div>

              <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  Multi-Wing
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Blocks A, B, C &amp; Dining Hall</div>
              </div>

              <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f472b6' }}>
                  4 Daily
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Dining Meals (Breakfast to Dinner)</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '16px 20px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Award size={24} color="#38bdf8" style={{ flexShrink: 0 }} />
              <span>Architected for University Residence Hall Administration &amp; Governance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
