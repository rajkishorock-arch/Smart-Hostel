import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Aayush Malhotra',
      role: '3rd Year CSE • Block A, Room 204',
      quote: 'When my room fan started making strange burning smells last term, I logged it on Smart Hostel at 11 PM. The AI auto-flagged it as Electrical Urgent. The warden dispatched the campus electrician by 9 AM next morning. Unbeatable speed!',
      rating: 5,
      avatar: 'AM'
    },
    {
      name: 'Dr. Rajeshwar Sundaram',
      role: 'Chief Hostel Warden • Campus Admin',
      quote: 'Managing 1,400+ students across four hostel wings used to be a nightmare of handwritten chits. With Smart Hostel, our maintenance board gives us live oversight of plumbing, electrical, and carpentry requests with zero lost tickets.',
      rating: 5,
      avatar: 'RS'
    },
    {
      name: 'Pooja Venkatesh',
      role: 'Student Mess Committee Head • Block B',
      quote: 'The weekly mess menu editor allows us to update the breakfast and dinner menus instantly. Students always know what is being served before walking into the dining hall, which reduced food wastage significantly.',
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
            Verified Campus Feedback
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
            Trusted by Residents &amp; Administration
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Real experiences from students, wardens, and mess committee members who use the system daily.
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
