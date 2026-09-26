import React from 'react';
import {
  UserCheck,
  DoorOpen,
  Wrench,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Check In',
      desc: 'Residents log in with student credentials. Wardens confirm room allotment and activate digital residential profile.',
      icon: <UserCheck size={24} color="#1e3a8a" />,
      tag: 'Onboarding',
      color: '#1e3a8a',
      bg: '#eff6ff',
      border: '#bfdbfe'
    },
    {
      step: '02',
      title: 'View Room & Meals',
      desc: 'Access your assigned Block, Room, and Bed. Check today’s 4 daily meals and weekly rotating dining menu in real time.',
      icon: <DoorOpen size={24} color="#059669" />,
      tag: 'Hostel & Mess',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    {
      step: '03',
      title: 'Lodge Issue',
      desc: 'Report electrical, plumbing, or carpentry faults. Built-in smart classification automatically tags trade and urgency.',
      icon: <Wrench size={24} color="#d97706" />,
      tag: 'Maintenance',
      color: '#d97706',
      bg: '#fef3c7',
      border: '#fde68a'
    },
    {
      step: '04',
      title: 'Track Resolution',
      desc: 'Follow your ticket live from Open → In Progress → Resolved. Wardens assign campus technicians with verified completion notes.',
      icon: <CheckCircle2 size={24} color="#2563eb" />,
      tag: 'Complete Care',
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '80px 0', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
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
            <span>Workflow Architecture</span>
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
            How Smart Hostel Operates
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A streamlined 4-step residential journey connecting students, wardens, and mess administrators.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            position: 'relative'
          }}
        >
          {steps.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Step indicator header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    fontFamily: 'monospace',
                    color: item.color
                  }}
                >
                  {item.step}
                </span>

                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </div>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: item.color,
                  marginBottom: '6px'
                }}
              >
                {item.tag}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
