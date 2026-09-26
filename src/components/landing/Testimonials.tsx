import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Aayush M.',
      role: 'Student Resident Persona • Block A, Room 204',
      quote: 'When my room fan had a burning smell, lodging it on the portal triggered the AI classifier to flag it as Electrical Urgent. The warden resolution board immediately picked up the priority ticket.',
      rating: 5,
      avatar: 'AM'
    },
    {
      name: 'Dr. R. Sundaram',
      role: 'Chief Warden Persona • Administration Desk',
      quote: 'Managing student blocks used to rely on handwritten chits. The Maintenance Resolution Board gives instant oversight of electrical, plumbing, and carpentry requests with verified resolution notes.',
      rating: 5,
      avatar: 'RS'
    },
    {
      name: 'Pooja V.',
      role: 'Mess Committee Persona • Dining Wing',
      quote: 'The weekly mess menu editor allows wardens to publish breakfast, lunch, and dinner menus instantly. Residents check timings before arriving, which keeps the dining schedule organized.',
      rating: 5,
      avatar: 'PV'
    }
  ];

  return (
    <section id="testimonials" style={{ padding: '80px 0', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px auto' }}>
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#4f46e5',
              letterSpacing: '0.08em'
            }}
          >
            User Experience Personas
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
            Role-Based Workflows in Action
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Illustrative workflow scenarios demonstrating how residents, wardens, and mess administrators interact with the platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}
        >
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '32px 28px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Rating stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '24px' }}>
                  "{rev.quote}"
                </p>
              </div>

              {/* Author info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  {rev.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {rev.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
