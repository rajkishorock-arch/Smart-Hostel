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
          {/* Left Column: Mission & Impact */}
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
              About Smart Hostel Administration
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
              Elevating Campus Residential Living Through Modern Tech
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Collegiate hostels house the leaders of tomorrow. Yet historically, hostel life has been
              hindered by lost complaints in paper registers, delayed electrical and plumbing fixes, and
              unpredictable mess schedules.
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              <strong>Smart Hostel</strong> was built by campus wardens and student engineers to replace
              chaotic WhatsApp groups and physical logbooks with a secure, real-time administrative platform.
              From room allocation to dining hygiene and AI-prioritized repairs, we ensure safety, transparency,
              and comfort.
            </p>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  24-Hour Maximum Turnaround for Critical Maintenance
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  100% Student Participation in Mess Nutrition Reviews
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                  Transparent Warden Resolution Log with Verified Timestamps
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Statistics & Highlights Box */}
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
                  Campus Hostel Network
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                  Operational Impact &amp; Metrics
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
                  1,450+
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Hostel Residents Managed</div>
              </div>

              <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>
                  98.4%
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Issues Resolved in &lt; 24h</div>
              </div>

              <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24' }}>
                  4 Blocks
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Blocks A, B, C &amp; Dining Hall</div>
              </div>

              <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '14px' }}>
                <div className="font-display" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f472b6' }}>
                  3 Daily
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Mess Quality Checks</div>
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
              <span>Awarded Best University Living Facility &amp; Digital Governance 2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
