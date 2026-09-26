import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  DoorClosed,
  Bed,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [hostel, setHostel] = useState('Aravali Boys Hostel');
  const [block, setBlock] = useState('Block A');
  const [roomNumber, setRoomNumber] = useState('204');
  const [bedNumber, setBedNumber] = useState('Bed 1');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanRoom = roomNumber.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid institutional email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!cleanRoom) {
      setError('Please provide your room number.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await signup({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone || '+91 98000 00000',
        hostel,
        block,
        roomNumber: cleanRoom,
        bedNumber
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
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
      <div style={{ maxWidth: '540px', width: '100%', margin: '0 auto' }}>
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
            Resident Student Registration
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Register your resident profile for room inventory, dining, and rapid maintenance
          </p>
        </div>

        {/* Card */}
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
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: '#eef2ff',
              color: '#3730a3',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '20px'
            }}
          >
            <User size={16} />
            <span>Hostel Resident Account Portal</span>
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

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                maxLength={60}
                placeholder="e.g. Aarav Sharma"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Institutional Email</label>
                <input
                  type="email"
                  required
                  maxLength={80}
                  placeholder="student@campus.edu"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                maxLength={100}
                placeholder="Minimum 6 characters"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* Room Allocation fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Hostel</label>
                <select className="form-select" value={hostel} onChange={e => setHostel(e.target.value)}>
                  <option value="Aravali Boys Hostel">Aravali Hostel</option>
                  <option value="Nilgiri Boys Hostel">Nilgiri Hostel</option>
                  <option value="Shivalik Girls Hostel">Shivalik Hostel</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Block / Wing</label>
                <select className="form-select" value={block} onChange={e => setBlock(e.target.value)}>
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room No.</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="e.g. 204"
                  className="form-input"
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bed No.</label>
                <select className="form-select" value={bedNumber} onChange={e => setBedNumber(e.target.value)}>
                  <option value="Bed 1">Bed 1 (Window)</option>
                  <option value="Bed 2">Bed 2 (Door)</option>
                  <option value="Bed 3">Bed 3 (Corner)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.95rem' }}
            >
              {submitting ? 'Creating Profile...' : 'Complete Resident Registration'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Notice regarding warden accounts */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 14px',
              background: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={16} color="#4f46e5" style={{ flexShrink: 0 }} />
            <span>
              Warden Administration accounts are provisioned exclusively through authorized campus credentials.{' '}
              <Link to="/login?role=warden" style={{ color: '#4f46e5', fontWeight: 700 }}>
                Warden Sign In
              </Link>
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
