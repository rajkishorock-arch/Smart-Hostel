import React from 'react';
import {
  Building,
  UtensilsCrossed,
  Sparkles,
  ClipboardList,
  Shield,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Building size={24} color="#4f46e5" />,
      tag: 'Hostel & Bed Registry',
      title: 'Digital Room & Bed Allocation',
      desc: 'Map every student to their specific Hostel, Block, Room, and Bed. Track live occupancy percentages, available beds, and roommate details without physical rosters.'
    },
    {
      icon: <UtensilsCrossed size={24} color="#10b981" />,
      tag: 'Nutritious Dining',
      title: 'Live Weekly Mess Timetable',
      desc: 'Full 7-day culinary calendar updated by the Warden. Students can view Breakfast, Lunch, High Tea, and Dinner menus along with serving timings and special dietary announcements.'
    },
    {
      icon: <Sparkles size={24} color="#f59e0b" />,
      tag: 'AI Assistance',
      title: 'Automatic Ticket Classification',
      desc: 'Contextual AI NLP scans resident problem descriptions. It detects trades (Electrical, Plumbing, Carpentry) and evaluates urgency levels automatically to eliminate routing delays.'
    },
    {
      icon: <ClipboardList size={24} color="#ec4899" />,
      tag: 'Full Transparency',
      title: 'Real-Time Maintenance Lifecycle',
      desc: 'Residents track their ticket status from Open to In Progress to Resolved in real time. Wardens attach technician notes and completion timestamps directly.'
    },
    {
      icon: <Shield size={24} color="#6366f1" />,
      tag: 'Campus Security',
      title: 'Strict Role-Based Authorization',
      desc: 'Hardened Firestore rules and client route protection ensure residents only access their own room data and tickets, while wardens maintain full administrative authority.'
    },
    {
      icon: <Clock size={24} color="#06b6d4" />,
      tag: 'Efficiency',
      title: 'Rapid Warden Resolution Desk',
      desc: 'Warden control room with aggregated metrics, one-click status transitions, room reassignment tools, and immediate resident notifications.'
    }
  ];

  return (
    <section id="features" style={{ padding: '80px 0', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 56px auto' }}>
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#4f46e5',
              letterSpacing: '0.08em'
            }}
          >
            Core Capabilities
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
            Purpose-Built for Campus Residence Life
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every module addresses concrete operational problems faced by hostel wardens,
            mess committees, and student residents every day.
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
              className="card"
              style={{
                padding: '28px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {f.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: '#eef2ff',
                    color: '#4338ca'
                  }}
                >
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {f.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
