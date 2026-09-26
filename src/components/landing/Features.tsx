import React from 'react';
import {
  DoorOpen,
  UtensilsCrossed,
  Wrench,
  Clock,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <DoorOpen size={24} color="#1e3a8a" />,
      tag: 'Hostel Module',
      title: 'Room Allocation',
      desc: 'View assigned room, block, and bed slot with clear occupancy status. Wardens maintain a live roster without physical room registers.',
      bg: '#eff6ff',
      border: '#bfdbfe'
    },
    {
      icon: <UtensilsCrossed size={24} color="#059669" />,
      tag: 'Mess Module',
      title: 'Smart Mess Menu',
      desc: 'Today’s 4 active meals (Breakfast, Lunch, High Tea, Dinner) and full weekly schedule. Instant updates when menu changes occur.',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    {
      icon: <Wrench size={24} color="#d97706" />,
      tag: 'Maintenance Module',
      title: 'Maintenance Tickets',
      desc: 'Report electrical, plumbing, and carpentry issues easily from your phone. Each ticket is automatically bound to your assigned room.',
      bg: '#fef3c7',
      border: '#fde68a'
    },
    {
      icon: <Clock size={24} color="#2563eb" />,
      tag: 'Transparency',
      title: 'Live Ticket Tracking',
      desc: 'Follow ticket status from Open → In Progress → Resolved in real time. Wardens attach resolution notes and completion details.',
      bg: '#eff6ff',
      border: '#bfdbfe'
    },
    {
      icon: <ShieldCheck size={24} color="#1e3a8a" />,
      tag: 'Operations',
      title: 'Warden Management',
      desc: 'Centralized console to manage residents, rooms, meals, and maintenance. Single-click status transitions and room assignments.',
      bg: '#eff6ff',
      border: '#bfdbfe'
    },
    {
      icon: <Cpu size={24} color="#b45309" />,
      tag: 'Smart Classification',
      title: 'AI Issue Classification',
      desc: 'Automatically suggests maintenance category (Electrical, Plumbing, Carpentry) and priority based on problem description.',
      bg: '#fef3c7',
      border: '#fde68a'
    }
  ];

  return (
    <section id="features" style={{ padding: '80px 0', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 52px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px'
            }}
          >
            <span>Core Capabilities</span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              marginTop: '4px',
              marginBottom: '14px'
            }}
          >
            Purpose-Built for Hostel &amp; Mess Life
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every capability directly addresses daily operations for hostel residents and wardens.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: f.bg,
                    border: `1px solid ${f.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {f.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    background: '#f8fafc',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                {f.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
