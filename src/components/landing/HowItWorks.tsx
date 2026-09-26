import React from 'react';
import {
  UserCheck,
  CalendarCheck,
  Bot,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <UserCheck size={26} color="#4f46e5" />,
      title: 'Digital Onboarding & Room Allotment',
      desc: 'Students register with their campus credentials. Wardens allocate Block, Room, and Bed numbers in a unified digital registry, eliminating manual room ledger bottlenecks.'
    },
    {
      step: '02',
      icon: <CalendarCheck size={26} color="#10b981" />,
      title: 'Real-Time Weekly Mess Timetable',
      desc: 'The chief warden publishes the 7-day culinary timetable for Breakfast, Lunch, High Tea, and Dinner. Residents immediately view menus, timings, and dietary notes on their portal.'
    },
    {
      step: '03',
      icon: <Bot size={26} color="#f59e0b" />,
      title: 'AI-Powered Maintenance Logging',
      desc: 'When an issue occurs (such as a sparking socket or clogged sink), the resident types the problem. Our built-in AI classifies it into Electrical, Plumbing, or Carpentry with urgency rating.'
    },
    {
      step: '04',
      icon: <CheckCircle size={26} color="#06b6d4" />,
      title: 'Warden Resolution & Real-Time Sync',
      desc: 'The Warden reviews tickets on their Resolution Board, assigns electricians or carpenters, and updates status from Open to In Progress to Resolved with completion notes.'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '80px 0', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px auto' }}>
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#4f46e5',
              letterSpacing: '0.08em'
            }}
          >
            System Architecture
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              marginTop: '8px',
              marginBottom: '16px'
            }}
          >
            How Smart Hostel Operates
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Designed specifically for university halls of residence to bridge communication gaps
            between student residents and administrative wardens.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            position: 'relative'
          }}
        >
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '32px 24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Step indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="font-display"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#cbd5e1'
                  }}
                >
                  {item.step}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, flexGrow: 1 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
