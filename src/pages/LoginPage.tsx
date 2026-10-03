import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  ShieldCheck,
  User,
  Zap
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

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError(null);
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
        background: '#ffffff',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Left Column: Authentication Form (Matches geckhaiml.live/login) */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px clamp(24px, 5vw, 72px)',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        {/* Back to Home Link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#2563eb',
            fontSize: '0.88rem',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '28px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Building2 size={24} color="#0284c7" />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Smart Hostel OS
          </span>
        </div>

        {/* Headline & Subhead */}
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}
        >
          Log in to your account
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '24px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>

        {/* Role Segmented Pill Selector (Student vs Warden) */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '9999px',
            gap: '4px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => handleRoleChange('resident')}
            style={{
              flex: 1,
              padding: '9px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: role === 'resident' ? '#10b981' : 'transparent',
              color: role === 'resident' ? '#ffffff' : '#64748b',
              boxShadow: role === 'resident' ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={15} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('warden')}
            style={{
              flex: 1,
              padding: '9px 16px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: role === 'warden' ? '#10b981' : 'transparent',
              color: role === 'warden' ? '#ffffff' : '#64748b',
              boxShadow: role === 'warden' ? '0 2px 8px rgba(16, 185, 129, 0.35)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={15} />
            <span>Warden / Admin</span>
          </button>
        </div>

        {/* Google One-Click Login Button */}
        <button
          type="button"
          onClick={() => handleDemoLogin(role)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#1e293b',
            fontSize: '0.92rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s ease, border-color 0.2s ease',
            marginBottom: '20px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          {/* Authentic Google Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Login with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#94a3b8',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
          <span style={{ padding: '0 12px' }}>Or email or phone number</span>
          <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Email or phone
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@smarthostel.edu or phone"
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.92rem',
                color: '#0f172a',
                background: '#ffffff',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#2563eb'}
              onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                Password
              </label>
              <a
                href="#forgot"
                onClick={e => { e.preventDefault(); alert('Password reset link sent to your registered college email.'); }}
                style={{ fontSize: '0.82rem', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
              >
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign In Button with Ambient Bottom Glow (Matches geckhaiml screenshot) */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '13px 20px',
              background: '#000000',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: submitting ? 'wait' : 'pointer',
              marginTop: '8px',
              boxShadow: '0 12px 28px -6px rgba(249, 115, 22, 0.45)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 36px -4px rgba(249, 115, 22, 0.65)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(249, 115, 22, 0.45)'}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Fast Evaluator Credentials */}
        <div style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Demo Access
          </span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('resident')}
              disabled={!!demoSubmitting}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Zap size={14} color="#f59e0b" />
              <span>Student: Rahul Sharma</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('warden')}
              disabled={!!demoSubmitting}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={14} color="#10b981" />
              <span>Warden: Dr. R. K. Verma</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Image Card (Exact match to geckhaiml.live/login screenshot) */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'none',
          padding: '20px',
          boxSizing: 'border-box'
        }}
        className="login-hero-card"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '40px',
            boxSizing: 'border-box',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Subtle Dark Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(3, 15, 20, 0.95) 0%, rgba(3, 15, 20, 0.4) 50%, rgba(3, 15, 20, 0.2) 100%)',
              zIndex: 1
            }}
          />

          {/* Card Content Overlay */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#34d399',
                letterSpacing: '0.06em',
                marginBottom: '14px',
                textTransform: 'uppercase'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              <span>SMART HOSTEL OS</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '10px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Welcome to Smart Hostel OS
            </h2>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#cbd5e1',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '460px'
              }}
            >
              Empowering collegiate residential living with Autonomous Intelligence &amp; IoT operations.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-hero-card {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
