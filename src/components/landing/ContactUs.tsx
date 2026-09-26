import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    room: '',
    subject: 'Room Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        room: '',
        subject: 'Room Inquiry',
        message: ''
      });
    }, 4000);
  };

  return (
    <section id="contact" style={{ padding: '80px 0', background: '#ffffff' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 56px auto' }}>
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#4f46e5',
              letterSpacing: '0.08em'
            }}
          >
            Get in Touch
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
            Hostel Helpdesk &amp; Warden Office
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Have questions regarding room changes, special meal diets, or emergency facilities?
            Reach out to our round-the-clock administration.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}
        >
          {/* Left: Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              className="card"
              style={{
                padding: '24px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b91c1c',
                  flexShrink: 0
                }}
              >
                <Phone size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  24/7 Warden Emergency Dispatch
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>
                  For urgent electrical shorts, pipe flooding, or medical assistance:
                </p>
                <a
                  href="tel:+911126597100"
                  style={{ fontSize: '1.05rem', fontWeight: 700, color: '#b91c1c' }}
                >
                  +91 (011) 2659-7100
                </a>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: '24px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4338ca',
                  flexShrink: 0
                }}
              >
                <Mail size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Warden Official Correspondence
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>
                  Inquiries regarding room swaps, fee receipts, or leave permissions:
                </p>
                <a
                  href="mailto:hostel-warden@campus.edu"
                  style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4338ca' }}
                >
                  hostel-warden@campus.edu
                </a>
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: '24px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  flexShrink: 0
                }}
              >
                <MapPin size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Hostel Administration Center
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Ground Floor, Block A Administrative Wing, Aravali Complex
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.8rem', color: '#475569' }}>
                  <Clock size={14} />
                  <span>Visiting Hours: 10:00 AM – 01:00 PM &amp; 03:00 PM – 06:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div
            className="card"
            style={{
              padding: '36px 32px',
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Send an Administrative Notice / Query
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '24px' }}>
              Non-emergency inquiries are reviewed by the Assistant Warden within 1 business day.
            </p>

            {submitted ? (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <CheckCircle size={36} color="#059669" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#065f46', margin: 0 }}>
                  Message Transmitted Successfully!
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#047857', margin: 0 }}>
                  Your query has been logged in the Hostel Administration dispatch registry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aayush Malhotra"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Institutional Email</label>
                    <input
                      type="email"
                      required
                      placeholder="student@campus.edu"
                      className="form-input"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Room / Block (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Room 204, Block A"
                      className="form-input"
                      value={formData.room}
                      onChange={e => setFormData({ ...formData, room: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Category</label>
                  <select
                    className="form-select"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Room Inquiry">Room Allocation / Swap Request</option>
                    <option value="Mess Inquiry">Special Dietary / Mess Feedback</option>
                    <option value="Facility Inquiry">Gym / Library / WiFi Facility</option>
                    <option value="Other">Other Administrative Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or request in detail..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  <Send size={18} />
                  <span>Transmit to Warden Office</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
