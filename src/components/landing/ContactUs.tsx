import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Wrench
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
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 52px auto' }}>
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
            <span>Contact &amp; Support</span>
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
            Hostel Administration &amp; Helpdesk
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Reach out to the warden administration desk for accommodation queries, mess arrangements, or administrative assistance.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px'
          }}
        >
          {/* Left: Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Administration Desk */}
            <div
              style={{
                padding: '24px',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e3a8a'
                    }}
                  >
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      Chief Warden Office
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Hostel Administrative Block (Ground Floor)
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
                  Demo Concept
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div><strong>Office Hours:</strong> Mon – Sat: 9:00 AM – 5:30 PM</div>
                <div><strong>Desk Contact:</strong> warden.desk@campus-hostel.edu (Demonstration)</div>
              </div>
            </div>

            {/* Emergency Maintenance Contact */}
            <div
              style={{
                padding: '24px',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#b45309'
                    }}
                  >
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      Emergency Maintenance Hotline
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      For electrical short circuits or severe plumbing leaks
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#92400e' }}>
                  Demo Concept
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div><strong>Helpline:</strong> Campus Ext. 108 / 109 (Demonstration)</div>
                <div><strong>Response Time:</strong> Urgent tickets prioritized via AI classifier</div>
              </div>
            </div>

            {/* Smart Mess Inquiry */}
            <div
              style={{
                padding: '24px',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669'
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      Mess Committee Desk
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Dietary requests &amp; dining schedule feedback
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#065f46' }}>
                  Demo Concept
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div><strong>Serving Timings:</strong> Breakfast, Lunch, Snacks, Dinner</div>
                <div><strong>Inquiries:</strong> mess.committee@campus-hostel.edu (Demonstration)</div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            style={{
              padding: '32px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Send an Inquiry to Administration
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
              Fill in your details below and the hostel warden desk will receive your request.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '24px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}
              >
                <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '1.1rem', fontWeight: 800 }}>
                  Inquiry Dispatched Successfully!
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#047857' }}>
                  Thank you! In this demonstration mode, your sample message has been verified and logged.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aayush Mishra"
                      className="input-field"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. aayush@campus.edu"
                      className="input-field"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label htmlFor="contact-room" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      Hostel &amp; Room Number
                    </label>
                    <input
                      id="contact-room"
                      type="text"
                      value={formData.room}
                      onChange={e => setFormData({ ...formData, room: e.target.value })}
                      placeholder="e.g. Aravali Block A, Rm 204"
                      className="input-field"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="input-field"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff' }}
                    >
                      <option value="Room Inquiry">Room Inquiry / Allocation</option>
                      <option value="Mess Feedback">Mess &amp; Dining Schedule</option>
                      <option value="Maintenance Followup">Maintenance Ticket Follow-up</option>
                      <option value="General Admin">General Administration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or request for the warden..."
                    className="input-field"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    background: '#1e3a8a',
                    borderColor: '#1e3a8a'
                  }}
                >
                  <Send size={16} />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
