import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const WardenRegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [hostel, setHostel] = useState('Aravali Boys Hostel');
  const [inviteCode, setInviteCode] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanCode = inviteCode.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid institutional email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!cleanCode) {
      setError('Institutional Warden Invitation Code is required.');
      return;
    }

    setSubmitting(true);

    try {
      // POST strictly to server-side Vercel endpoint /api/warden/register
      const response = await fetch('/api/warden/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          phone: cleanPhone || '+91 98000 00000',
          hostel,
          inviteCode: cleanCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Warden registration rejected by authorization server.');
      }

      setSuccess('Warden credentials verified and authorized! Redirecting to official login...');
      setTimeout(() => {
        navigate('/login?role=warden', {
          state: { successMessage: 'Warden registration complete. Please sign in with your verified credentials.' }
        });
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Warden onboarding failed. Please verify your invitation secret.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      <div style={{ maxWidth: '540px', width: '100%', margin: '0 auto' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)'
              }}
            >
              <Building2 size={22} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Smart<span style={{ color: '#2563eb' }}>Hostel</span> &amp; Mess
            </span>
          </Link>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Warden Administrator Onboarding
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Institutional Registration Station for Residential Hall Authorities
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{
            padding: '32px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid #e2e8f0'
          }}
        >
          {/* Security Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={16} />
            <span>Institutional Authority Verification Required</span>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.78rem',
              color: '#475569',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}
          >
            <strong>Note:</strong> Warden privileges are restricted to verified hall authorities. Every registration requires an institutional invitation code validated server-side.
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Full Legal Name
              </label>
              <input
                type="text"
                required
                maxLength={60}
                placeholder="e.g. Dr. Rajesh Verma"
                className="form-input"
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                value={name}
                onChange={e => { setName(e.target.value); if (error) setError(null); }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Institutional Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    maxLength={80}
                    placeholder="warden@campus.edu"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '40px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError(null); }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Official Phone
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '40px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '40px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                  Hostel Jurisdiction
                </label>
                <select
                  value={hostel}
                  onChange={e => setHostel(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff' }}
                >
                  <option value="Aravali Boys Hostel">Aravali Boys Hostel</option>
                  <option value="Nilgiri Girls Hostel">Nilgiri Girls Hostel</option>
                  <option value="Shivalik Executive Hostel">Shivalik Executive Hostel</option>
                </select>
              </div>
            </div>

            {/* Secret Institutional Key */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#b91c1c', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={15} color="#b91c1c" /> Institutional Warden Invitation Code
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#dc2626'
                  }}
                />
                <input
                  type="password"
                  required
                  placeholder="Enter secret institution invitation code"
                  className="form-input"
                  style={{
                    width: '100%',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    height: '42px',
                    borderRadius: '8px',
                    border: '2px solid #f87171',
                    background: '#fff5f5'
                  }}
                  value={inviteCode}
                  onChange={e => { setInviteCode(e.target.value); if (error) setError(null); }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Provided by Campus Administration Department. Validated strictly on server.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: '#065f46',
                borderColor: '#065f46'
              }}
            >
              {submitting ? 'Verifying with Server...' : 'Verify Secret & Complete Warden Onboarding'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
            Looking for Resident Student Registration?{' '}
            <Link to="/register" style={{ color: '#1e3a8a', fontWeight: 700 }}>
              Student Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
