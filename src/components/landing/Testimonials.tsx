import React from 'react';
import {
  User,
  ShieldCheck,
  UtensilsCrossed,
  Quote
} from 'lucide-react';

export const Testimonials: React.FC = () => {
  const perspectives = [
    {
      title: 'Resident Perspective',
      subtitle: 'Illustrative user perspective',
      icon: <User size={22} color="#1e3a8a" />,
      tag: 'Hostel Resident',
      need: '“When my study room fan stopped working before exams, I used to search for the complaint notebook in the warden office. With Smart Hostel, I lodged it on my phone in 20 seconds. The smart classifier automatically tagged it as Electrical, and I could track when the electrician was on the way.”',
      highlight: 'Transparent 20-second issue reporting & status tracking',
      bg: '#eff6ff',
      border: '#bfdbfe'
    },
    {
      title: 'Warden Perspective',
      subtitle: 'Illustrative user perspective',
      icon: <ShieldCheck size={22} color="#059669" />,
      tag: 'Chief Warden',
      need: '“Managing multiple hostel blocks used to mean endless phone calls and duplicate complaints. The centralized Maintenance Board groups issues by trade, while room allocation lets us confirm student check-ins and bed vacancies instantly.”',
      highlight: 'Unified control over rooms, occupancy, and repair tasks',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    {
      title: 'Mess Committee Perspective',
      subtitle: 'Illustrative user perspective',
      icon: <UtensilsCrossed size={22} color="#d97706" />,
      tag: 'Mess Administration',
      need: '“Publishing weekly meal schedules digitally prevents unnecessary student inquiries at the dining hall entrance. Everyone knows what is being served for Breakfast, Lunch, Snacks, and Dinner along with serving timings.”',
      highlight: 'Real-time 7-day culinary calendar & meal timings',
      bg: '#fef3c7',
      border: '#fde68a'
    }
  ];

  return (
    <section id="perspectives" style={{ padding: '80px 0', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px auto' }}>
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
            <span>What Users Need</span>
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
            User Perspectives &amp; Real-World Needs
          </h2>

          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Illustrative perspectives reflecting the practical pain points addressed for residents, wardens, and mess administrators.
          </p>
        </div>

        {/* Perspectives Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {perspectives.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: p.bg,
                      border: `1px solid ${p.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {p.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {p.subtitle}
                    </span>
                  </div>
                </div>

                <Quote size={20} color="#cbd5e1" />
              </div>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '20px', flexGrow: 1 }}>
                {p.need}
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  color: '#1e293b',
                  fontWeight: 600
                }}
              >
                Key Benefit: {p.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
