import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ParticleWave } from '../components/common/ParticleWave';
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
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [hostel, setHostel] = useState('Aravali Boys Hostel');
  const [block, setBlock] = useState('Block A');
  const [allocationPreference, setAllocationPreference] = useState<'pending' | 'direct'>('pending');
  const [roomNumber, setRoomNumber] = useState('');
  const [bedNumber, setBedNumber] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanParentPhone = parentPhone.trim();

    if (!cleanName || cleanName.length < 2) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid institutional email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (!cleanParentPhone) {
      setError('Parent / Guardian contact number is required for hostel verification.');
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone || '+91 98765 43210',
        hostel,
        block,
        roomNumber: allocationPreference === 'direct' ? roomNumber : '',
        bedNumber: allocationPreference === 'direct' ? bedNumber : '',
        parentPhone: cleanParentPhone,
        bloodGroup,
        emergencyContact: emergencyContact || cleanParentPhone
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check input details.');
    } finally {
      setSubmitting(false);
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
        padding: '40px 16px',
        overflow: 'hidden'
      }}
    >
      {/* 3D Undulating Particle Wave background */}
      <ParticleWave opacity={0.65} />

      {/* Radial Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(0, 191, 251, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
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
            Student Resident Onboarding
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
            Register your profile for digital room allocation, mess dining, out-passes, and curfew sync
          </p>
        </div>

        {/* Form Glass Card */}
        <div
          className="glass-card"
          style={{
            padding: '32px',
            border: '1px solid rgba(0, 191, 251, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 191, 251, 0.12)'
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(0, 191, 251, 0.1)',
              color: '#00BFFB',
              border: '1px solid rgba(0, 191, 251, 0.3)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '24px'
            }}
          >
            <User size={16} />
            <span>Autonomous Resident Registration Node</span>
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

          <form onSubmit={handleRegister}>
            {/* Step 1: Personal Credentials */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00BFFB', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                1. Student Profile
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Maurya"
                    className="cyber-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@campus.edu"
                    className="cyber-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact & Parent Phone */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00BFFB', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                2. Contact &amp; Emergency Verification
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                    Student Mobile No.
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="cyber-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                    Parent / Guardian Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94310 12345"
                    className="cyber-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                    Blood Group
                  </label>
                  <select
                    className="cyber-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg} style={{ background: '#0f172a', color: '#ffffff' }}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                    Account Password (min. 6 chars) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="cyber-input"
                      style={{ width: '100%', paddingRight: '40px', boxSizing: 'border-box' }}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
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
              </div>
            </div>

            {/* Step 3: Room Allocation Status */}
            <div style={{ marginBottom: '26px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00BFFB', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                3. Room Allocation Mode
              </span>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '14px'
                }}
              >
                <div
                  onClick={() => setAllocationPreference('pending')}
                  style={{
                    background: allocationPreference === 'pending' ? 'rgba(0, 191, 251, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${allocationPreference === 'pending' ? 'rgba(0, 191, 251, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle2 size={16} color={allocationPreference === 'pending' ? '#00BFFB' : '#64748b'} />
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>Awaiting Warden Assignment</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                    Recommended: Chief Warden assigns an available room from the roster.
                  </p>
                </div>

                <div
                  onClick={() => setAllocationPreference('direct')}
                  style={{
                    background: allocationPreference === 'direct' ? 'rgba(0, 191, 251, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${allocationPreference === 'direct' ? 'rgba(0, 191, 251, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <CheckCircle2 size={16} color={allocationPreference === 'direct' ? '#00BFFB' : '#64748b'} />
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>Select Vacant Room</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                    Pick an existing vacant bed slot directly.
                  </p>
                </div>
              </div>

              {allocationPreference === 'direct' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Room Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 205"
                      className="cyber-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      value={roomNumber}
                      onChange={e => setRoomNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Bed Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bed 1"
                      className="cyber-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      value={bedNumber}
                      onChange={e => setBedNumber(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="cyber-btn-cyan"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{submitting ? 'Creating Secure Account...' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already have an active account?{' '}
          <Link to="/login" style={{ color: '#00BFFB', fontWeight: 700, textDecoration: 'none' }}>
            Sign In to Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};
