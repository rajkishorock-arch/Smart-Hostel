import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  HeartHandshake
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Smart<span style={{ color: '#818cf8' }}>Hostel</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '20px' }}>
              Unified residential campus administration platform automating room allocation, mess dining schedules,
              and AI-classified rapid maintenance resolution for student hostels.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
              <Shield size={16} color="#34d399" />
              <span>ISO 27001 Certified Campus Operations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  Public Overview
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  Allocation & Dining Workflow
                </a>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  Resident Sign In
                </Link>
              </li>
              <li>
                <Link to="/login?role=warden" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  Warden Administration Desk
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                  New Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Hostel Modules */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operational Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
                Digital Room & Bed Inventory
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                Weekly Mess Nutrition & Menu Sync
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                AI Categorization (Electrical, Plumbing, Carpentry)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899' }} />
                Warden Resolution Audit Trail
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus Hostel Helpdesk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: '#818cf8', marginTop: '2px', flexShrink: 0 }} />
                <span>Central Hostel Office, Block A Ground Floor, Campus Main Road</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} style={{ color: '#34d399', flexShrink: 0 }} />
                <span>Emergency Warden Hotline: +91 (011) 2659-7100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <span>hostel-warden@campus.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                <span>Office Hours: 08:00 AM – 08:00 PM (Emergency 24/7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.825rem',
            color: '#64748b'
          }}
        >
          <div>
            © {new Date().getFullYear()} Smart Hostel & Mess Administration. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Privacy Guidelines</span>
            <span>Hostel Code of Conduct</span>
            <span>Mess Hygiene Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
