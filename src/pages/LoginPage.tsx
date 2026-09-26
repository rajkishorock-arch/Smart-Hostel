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
  Sparkles,
  Zap
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login(email, password, role);
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

  const handleDemoFill = async (targetRole: UserRole) => {
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
      setError(err.message || 'Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Building2 size={24} />
            </div>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Smart<span style={{ color: '#4f46e5' }}>Hostel</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Sign In to Campus Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Select your role to access your personalized workstation
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card"
          style={{
            padding: '32px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-lg)',
            border: '1.5px solid #e2e8f0'
          }}
        >
          {/* Role Switcher Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}
          >
            <button
              type="button"
              onClick={() => setRole('resident')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: role === 'resident' ? '#4f46e5' : '#64748b',
                background: role === 'resident' ? '#ffffff' : 'transparent',
                boxShadow: role === 'resident' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={16} />
              <span>Resident</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('warden')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: role === 'warden' ? '#4338ca' : '#64748b',
                background: role === 'warden' ? '#ffffff' : 'transparent',
                boxShadow: role === 'warden' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={16} />
              <span>Warden Admin</span>
            </button>
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {role === 'resident' ? 'Resident Student Email' : 'Warden Official Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
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
                  placeholder={role === 'resident' ? 'resident@hostel.edu' : 'warden@hostel.edu'}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
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
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
            >
              {submitting ? 'Verifying...' : `Access ${role === 'warden' ? 'Warden Admin Desk' : 'Resident Portal'}`}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Login Fillers for Evaluators */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Instant Evaluator Access
              </span>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>One-Click Login</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('resident')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', padding: '8px 10px' }}
              >
                <User size={14} color="#4f46e5" />
                <span style={{ fontSize: '0.8rem', textAlign: 'left' }}>Demo Resident</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('warden')}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', padding: '8px 10px' }}
              >
                <ShieldCheck size={14} color="#059669" />
                <span style={{ fontSize: '0.8rem', textAlign: 'left' }}>Demo Warden</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer link to register */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' }}>
          New campus resident without an account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>
            Register Room Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
