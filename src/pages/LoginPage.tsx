import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Building2,
  ShieldCheck,
  User,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole: UserRole = searchParams.get('role') === 'warden' ? 'warden' : 'resident';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login(email, password);
      // Route based on authentic verified role
      if (user.role === 'warden') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (targetRole: UserRole) => {
    setError(null);
    setSubmitting(true);
    try {
      const user = await quickDemoLogin(targetRole);
      if (user.role === 'warden') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed. Verify environment credentials.');
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
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
        {/* Brand Header */}
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
            Sign In to Campus Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Official Residential &amp; Mess Management Station
          </p>
        </div>

        {/* Login Card */}
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
          {/* Portal Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleChange('resident')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: role === 'resident' ? '#1e3a8a' : '#64748b',
                background: role === 'resident' ? '#ffffff' : 'transparent',
                boxShadow: role === 'resident' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <User size={15} />
              <span>Resident</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('warden')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: role === 'warden' ? '#1e3a8a' : '#64748b',
                background: role === 'warden' ? '#ffffff' : 'transparent',
                boxShadow: role === 'warden' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={15} />
              <span>Warden Admin</span>
            </button>
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'block' }}>
                {role === 'resident' ? 'Resident Student Email' : 'Warden Official Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder={role === 'resident' ? 'resident@campus.edu' : 'warden@campus.edu'}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '42px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box' }}
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'block' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '42px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box' }}
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '0.95rem',
                background: '#1e3a8a',
                borderColor: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Evaluator Access Area (strictly gated by VITE_DEMO_MODE=true) */}
          {import.meta.env.VITE_DEMO_MODE === 'true' && (
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Evaluator Instant Access
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ecfdf5',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0'
                  }}
                >
                  <CheckCircle2 size={12} />
                  Demo Mode Active
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button
                  id="demo-resident-btn"
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('resident')}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1e3a8a', fontSize: '0.825rem' }}>
                    <User size={14} color="#2563eb" />
                    <span>Demo Resident</span>
                  </div>
                </button>

                <button
                  id="demo-warden-btn"
                  type="button"
                  disabled={submitting}
                  onClick={() => handleDemoLogin('warden')}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#065f46', fontSize: '0.825rem' }}>
                    <ShieldCheck size={14} color="#059669" />
                    <span>Demo Warden</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer links to register */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            New student resident?{' '}
            <Link to="/register" style={{ color: '#1e3a8a', fontWeight: 700, textDecoration: 'none' }}>
              Register Room Profile
            </Link>
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Hostel Administrator?{' '}
            <Link to="/warden/register" style={{ color: '#065f46', fontWeight: 700, textDecoration: 'none' }}>
              Official Warden Onboarding →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
