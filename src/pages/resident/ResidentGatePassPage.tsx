import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GatePassRequest } from '../../types';
import {
  subscribeGatePasses,
  createGatePass
} from '../../services/storageService';
import {
  QrCode,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Send,
  Printer,
  ChevronRight,
  User,
  MapPin,
  PhoneCall
} from 'lucide-react';

export const ResidentGatePassPage: React.FC = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPassForQR, setSelectedPassForQR] = useState<GatePassRequest | null>(null);

  // Form fields
  const [passType, setPassType] = useState<'day_pass' | 'weekend_leave' | 'emergency_leave' | 'vacation'>('day_pass');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('17:00');
  const [expectedReturnTime, setExpectedReturnTime] = useState('21:00');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeGatePasses((allPasses) => {
      // Filter for this student
      const userPasses = allPasses.filter(p => p.residentId === user.uid || (user.id && p.residentId === user.id));
      setPasses(userPasses);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);

    if (!reason.trim()) {
      setFormError('Please describe the reason for leaving campus.');
      return;
    }
    if (!destination.trim()) {
      setFormError('Please specify destination location.');
      return;
    }

    setSubmitting(true);
    try {
      await createGatePass({
        residentId: user.uid,
        residentName: user.name,
        studentEmail: user.email,
        roomNumber: user.roomNumber || '204',
        bedNumber: user.bedNumber || 'Bed 1',
        block: user.block || 'Block A',
        leaveType: passType === 'day_pass' ? 'Local Outing' : passType === 'weekend_leave' ? 'Home Visit' : 'Emergency',
        type: passType,
        parentPhone: user.parentPhone || '+91 94310 12345',
        parentContact: user.parentPhone || '+91 94310 12345',
        reason: reason.trim(),
        destination: destination.trim(),
        departureDate,
        expectedReturnDate,
        departureTime,
        expectedReturnTime
      });

      setShowApplyModal(false);
      setReason('');
      setDestination('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit gate pass request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: GatePassRequest['status']) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
          <CheckCircle2 size={13} /> APPROVED
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
          <XCircle size={13} /> REJECTED
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
        <Clock size={13} /> PENDING WARDEN SIGN-OFF
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Digital Gate Pass &amp; Campus Leaves
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
            Request verified out-passes for town visits, weekends, or emergency leaves with security QR authentication.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, #00BFFB 0%, #0284c7 100%)',
            border: 'none',
            color: '#030712',
            fontWeight: 700,
            boxShadow: '0 0 15px rgba(0, 191, 251, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px'
          }}
        >
          <Plus size={18} />
          <span>Apply for Gate Pass</span>
        </button>
      </div>

      {/* Info Notice */}
      <div
        style={{
          background: 'rgba(0, 191, 251, 0.06)',
          border: '1px solid rgba(0, 191, 251, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <ShieldCheck size={24} color="#00BFFB" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
          <strong style={{ color: '#0f172a' }}>Campus Curfew Protocol:</strong> Standard hostel gates lock at 10:00 PM. All day out-passes must be scanned back at the main security guard gate before curfew. Home leaves send an automatic SMS notification to your verified parent mobile number.
        </div>
      </div>

      {/* Gate Pass List */}
      <div className="card" style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '18px' }}>
          My Out-Pass &amp; Leave History ({passes.length})
        </h3>

        {loading ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>Loading digital pass registry...</div>
        ) : passes.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1'
            }}
          >
            <QrCode size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
              No Out-Pass Applications Yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '400px', margin: '0 auto 16px auto' }}>
              Whenever you need to step out of the campus after hours or go home for the weekend, submit a digital gate pass request here.
            </p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn btn-outline btn-sm"
              style={{ color: '#0284c7', borderColor: '#0284c7' }}
            >
              Submit First Out-Pass
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {passes.map(pass => (
              <div
                key={pass.id}
                style={{
                  background: '#f8fafc',
                  border: pass.status.toLowerCase() === 'approved' ? '1.5px solid #a7f3d0' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: pass.status.toLowerCase() === 'approved' ? '0 4px 12px rgba(16, 185, 129, 0.08)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        PASS ID: {pass.id.slice(0, 10).toUpperCase()}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'capitalize' }}>
                        {(pass.type || pass.leaveType || 'Gate Pass').replace('_', ' ')}
                      </h4>
                    </div>
                    {getStatusBadge(pass.status)}
                  </div>

                  <div style={{ fontSize: '0.825rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="#0284c7" />
                      <span>
                        Out: <strong>{pass.departureDate}</strong> {pass.departureTime ? `at ${pass.departureTime}` : ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="#0284c7" />
                      <span>
                        Expected In: <strong>{pass.expectedReturnDate}</strong> {pass.expectedReturnTime ? `at ${pass.expectedReturnTime}` : ''}
                      </span>
                    </div>
                    {pass.destination && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color="#64748b" />
                        <span>Destination: {pass.destination}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', fontSize: '0.8rem', color: '#334155', marginBottom: '16px' }}>
                    <strong>Reason:</strong> {pass.reason}
                  </div>
                </div>

                {pass.status.toLowerCase() === 'approved' && (
                  <button
                    onClick={() => setSelectedPassForQR(pass)}
                    className="btn btn-sm"
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: '#ffffff',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}
                  >
                    <QrCode size={16} />
                    <span>View Gate Security QR Pass</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                  <QrCode size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    New Gate Pass Request
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Resident: {user?.name} (Room {user?.roomNumber || '204'})</span>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                style={{ fontSize: '1.4rem', color: '#64748b', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Out-Pass Type</label>
                <select
                  className="form-select"
                  value={passType}
                  onChange={e => setPassType(e.target.value as any)}
                >
                  <option value="day_pass">Day Out-Pass (Town visit / Market / Return before 10 PM)</option>
                  <option value="weekend_leave">Weekend Home Leave (Friday evening to Sunday night)</option>
                  <option value="emergency_leave">Emergency Medical / Family Leave</option>
                  <option value="vacation">Academic Vacation / Semester Break</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Out Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Out Time</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={departureTime}
                    onChange={e => setDepartureTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Expected Return Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={expectedReturnDate}
                    onChange={e => setExpectedReturnDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Expected Return Time</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={expectedReturnTime}
                    onChange={e => setExpectedReturnTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Destination Address / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Center Mall, Patna or Home Address"
                  className="form-input"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Reason for Leaving Campus *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Purchasing academic project supplies from city electronics market."
                  className="form-textarea"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ background: '#0284c7', borderColor: '#0284c7' }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit to Warden Desk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Security Pass Card Modal */}
      {selectedPassForQR && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '420px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              textAlign: 'center',
              position: 'relative',
              border: '2px solid #10b981'
            }}
          >
            {/* Verified Header Ribbon */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#10b981',
                color: '#ffffff',
                padding: '4px 20px',
                borderRadius: '0 0 12px 12px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.06em'
              }}
            >
              OFFICIAL GATE SECURITY OUT-PASS
            </div>

            <div style={{ marginTop: '16px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {user?.name}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                Room {selectedPassForQR.roomNumber} ({selectedPassForQR.bedNumber}) • Aravali Hall
              </p>
            </div>

            {/* Generated Simulated QR Code */}
            <div
              style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 20px auto',
                background: '#0f172a',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px dashed #00BFFB',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  gap: '8px'
                }}
              >
                <QrCode size={72} color="#00BFFB" />
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
                  SCAN AT GATE // VALID
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', fontSize: '0.825rem', textAlign: 'left', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Pass ID:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedPassForQR.id.slice(0, 12).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Authorized Out:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedPassForQR.departureDate} ({selectedPassForQR.departureTime})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Curfew Deadline:</span>
                <span style={{ fontWeight: 700, color: '#b91c1c' }}>{selectedPassForQR.expectedReturnDate} ({selectedPassForQR.expectedReturnTime})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Parent Verification:</span>
                <span style={{ fontWeight: 700, color: '#15803d' }}>Confirmed</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => setSelectedPassForQR(null)}
                className="btn btn-primary"
                style={{ flex: 1, background: '#0f172a', borderColor: '#0f172a' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
