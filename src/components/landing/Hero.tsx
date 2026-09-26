import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Utensils,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Users
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated, isWarden, quickDemoLogin } = useAuth();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px',
        paddingBottom: '80px',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #e0e7ff 0%, #f8fafc 100%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container">
        {/* Top announcement pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: '#ffffff',
              borderRadius: '9999px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #e0e7ff',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#3730a3'
            }}
          >
            <Sparkles size={16} color="#6366f1" />
            <span>Next-Gen Campus Residential & Mess System</span>
            <span style={{ background: '#4f46e5', color: '#ffffff', padding: '1px 8px', borderRadius: '9999px', fontSize: '0.72rem' }}>
              Active 2026
            </span>
          </div>
        </div>

        {/* Main Header Text */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 40px auto' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: '20px'
            }}
          >
            Smart Living, Nutritious Dining &amp;{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Rapid Hostel Care
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}
          >
            The unified residential platform connecting students and hostel administration.
            Digital room inventory, dynamic weekly mess timetables, and AI-assisted maintenance
            ticket classification for lightning-fast repairs.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '28px'
            }}
          >
            <Link to="/login" className="btn btn-primary btn-lg">
              <span>Resident Login</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/login?role=warden" className="btn btn-secondary btn-lg" style={{ borderColor: '#cbd5e1' }}>
              <ShieldCheck size={18} color="#4f46e5" />
              <span>Warden Admin Desk</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => quickDemoLogin('resident')}
                className="btn btn-outline btn-lg"
                style={{ background: '#ffffff', color: '#1e293b' }}
                title="Instant access as Demo Resident"
              >
                <Zap size={16} color="#f59e0b" />
                <span>Demo Student</span>
              </button>
              <button
                onClick={() => quickDemoLogin('warden')}
                className="btn btn-outline btn-lg"
                style={{ background: '#ffffff', color: '#1e293b' }}
                title="Instant access as Demo Warden"
              >
                <ShieldCheck size={16} color="#10b981" />
                <span>Demo Warden</span>
              </button>
            </div>
          </div>

          {/* Trust points */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '0.875rem',
              color: '#64748b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Zero Paperwork Allocations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Instant AI Ticket Categorization</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Real-time Mess Menu Synchronized</span>
            </div>
          </div>
        </div>

        {/* Feature Preview Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '20px'
          }}
        >
          {/* Card 1: Room Allocation */}
          <div
            className="card"
            style={{
              padding: '24px',
              background: '#ffffff',
              borderTop: '4px solid #4f46e5'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5'
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Digital Room Allocation</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Aravali &amp; Nilgiri Hostels</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
              Transparent hostel, block, room, and bed assignments with real-time occupancy counts and student directory.
            </p>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Room 204 • Block A</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>Occupied (Bed 1 &amp; 2)</span>
            </div>
          </div>

          {/* Card 2: Mess & Nutrition */}
          <div
            className="card"
            style={{
              padding: '24px',
              background: '#ffffff',
              borderTop: '4px solid #10b981'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}
              >
                <Utensils size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Weekly Mess Timetable</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Breakfast • Lunch • Snacks • Dinner</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
              Warden-curated meal schedules, balanced student nutrition, and instant broadcast of special dining events.
            </p>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Tonight's Dinner</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>Shahi Paneer &amp; Gulab Jamun</span>
            </div>
          </div>

          {/* Card 3: AI Maintenance Classification */}
          <div
            className="card"
            style={{
              padding: '24px',
              background: '#ffffff',
              borderTop: '4px solid #f59e0b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d97706'
                }}
              >
                <Wrench size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>AI Maintenance Engine</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Electrical • Plumbing • Carpentry</span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
              Automatic classification of issue reports into repair trades with urgency scoring to alert wardens immediately.
            </p>
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>"Fan burning smell"</span>
              <span className="badge badge-category-electrical" style={{ fontSize: '0.7rem' }}>🤖 Electrical (Urgent)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
