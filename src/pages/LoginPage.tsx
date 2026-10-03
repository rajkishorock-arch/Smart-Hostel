import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { OrbitalCoreCanvas } from '../components/common/OrbitalCoreCanvas';
import {
  Building2,
  ShieldCheck,
  User,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Zap,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole: UserRole = searchParams.get('role') === 'warden' ? 'warden' : 'resident';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState<'resident' | 'warden' | null>(null);

  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

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
      if (user.role === 'warden') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (targetRole: UserRole) => {
    setError(null);
    setDemoSubmitting(targetRole);
    try {
      const user = await quickDemoLogin(targetRole);
      if (user.role === 'warden') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setDemoSubmitting(null);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 16px',
        overflow: 'hidden'
      }}
    >
      {/* 3D Jarvis Orbital Core Particle Field in background */}
      <OrbitalCoreCanvas />

      {/* Radial Glow Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(0, 191, 251, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00BFFB 0%, #1e3a8a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(0, 191, 251, 0.5)'
              }}
            >
              <Building2 size={24} />
            </div>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Smart<span style={{ color: '#00BFFB', textShadow: '0 0 14px rgba(0, 191, 251, 0.6)' }}>Hostel</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Campus Living Portal Access
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            Autonomous Residential Operations Station
          </p>
        </div>

        {/* Glass Card */}
        <div
          className="glass-card"
          style={{
            padding: '32px',
            border: '1px solid rgba(0, 191, 251, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 191, 251, 0.12)'
          }}
        >
          {/* Role Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '22px'
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
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: role === 'resident' ? '#00BFFB' : '#94a3b8',
                background: role === 'resident' ? 'rgba(0, 191, 251, 0.15)' : 'transparent',
                border: role === 'resident' ? '1px solid rgba(0, 191, 251, 0.3)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
            >
              <User size={15} />
              <span>Resident Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('warden')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: role === 'warden' ? '#38bdf8' : '#94a3b8',
                background: role === 'warden' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                border: role === 'warden' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={15} />
              <span>Hostel Warden</span>
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '12px 14px',
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                {role === 'resident' ? 'Student Email' : 'Warden Official Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder={role === 'resident' ? 'student@campus.edu' : 'warden@campus.edu'}
                  className="cyber-input"
                  style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: '6px',
                  display: 'block'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="cyber-input"
                  style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', boxSizing: 'border-box' }}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || demoSubmitting !== null}
              className="cyber-btn-cyan"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{submitting ? 'Authenticating Credentials...' : 'Authenticate & Enter'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Instant Demo Access (Evaluation Mode) */}
          {isDemoMode && (
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#94a3b8',
                    letterSpacing: '0.04em'
                  }}
                >
                  INSTANT DEMO PROFILES
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#00BFFB',
                    background: 'rgba(0, 191, 251, 0.1)',
                    border: '1px solid rgba(0, 191, 251, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}
                >
                  ⚡ One-Click Auth
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button
                  id="demo-resident-btn"
                  type="button"
                  disabled={submitting || demoSubmitting !== null}
                  onClick={() => handleDemoLogin('resident')}
                  className="cyber-btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 10px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: submitting || demoSubmitting !== null ? 'not-allowed' : 'pointer'
                  }}
                >
                  <User size={15} color="#00BFFB" />
                  <span>{demoSubmitting === 'resident' ? 'Entering...' : 'Demo Student'}</span>
                </button>

                <button
                  id="demo-warden-btn"
                  type="button"
                  disabled={submitting || demoSubmitting !== null}
                  onClick={() => handleDemoLogin('warden')}
                  className="cyber-btn-outline"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 10px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: submitting || demoSubmitting !== null ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ShieldCheck size={15} color="#38bdf8" />
                  <span>{demoSubmitting === 'warden' ? 'Entering...' : 'Demo Warden'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer links */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '22px',
            fontSize: '0.85rem',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div>
            Need a student resident account?{' '}
            <Link to="/register" style={{ color: '#00BFFB', fontWeight: 700, textDecoration: 'none' }}>
              Register Profile →
            </Link>
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Official Hostel Administrator?{' '}
            <Link to="/warden/register" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>
              Warden Node Onboarding →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
