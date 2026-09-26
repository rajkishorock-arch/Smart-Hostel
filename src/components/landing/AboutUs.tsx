import React from 'react';
import {
  Building2,
  UtensilsCrossed,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Users
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
          {/* Left Column: Product Purpose */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '12px'
              }}
            >
              <span>Product Purpose</span>
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '4px',
                marginBottom: '18px',
                lineHeight: 1.2
              }}
            >
              Unified Hostel &amp; Mess Operations
            </h2>

            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
              Designed to simplify hostel operations by connecting residents, wardens, room allocation,
              mess schedules and maintenance requests in one place.
            </p>

            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '28px' }}>
              In traditional hostel management, paper registers lead to lost complaints, miscommunicated meal changes,
              and confusion over bed occupancy. Smart Hostel solves this with a white-first, role-separated platform
              tailored specifically for college residence halls.
            </p>

            {/* Core Architectural Focus */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#1e3a8a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                  <strong>Resident Privacy &amp; Access:</strong> Strict role separation ensures residents access only their personal room and ticket details.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                  <strong>Operational Dining Rhythm:</strong> Weekly schedules keep meal preparation and student arrival times coordinated.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: '#334155' }}>
                  <strong>Rapid Maintenance Dispatch:</strong> Automated trade suggestion helps wardens allocate electricians, plumbers, and carpenters promptly.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Pillar Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Core Functional Pillars
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Pillar 1 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Building2 size={20} color="#1e3a8a" />
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Hostel Infrastructure
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  Digital registry for blocks, rooms, bed capacity, and real-time student allocations.
                </p>
              </div>

              {/* Pillar 2 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <UtensilsCrossed size={20} color="#059669" />
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Mess Administration
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  Warden-curated weekly nutritional menus, daily meal timelines, and special culinary notices.
                </p>
              </div>

              {/* Pillar 3 */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Wrench size={20} color="#d97706" />
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Maintenance Lifecycle
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  Ticket logging with smart trade matching, warden task board, and completion audit trails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
