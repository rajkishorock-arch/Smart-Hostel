import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { createRoomChangeRequest } from '../../services/storageService';
import {
  FileText,
  Building2,
  Bed,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Calendar,
  UserCheck,
  Clock,
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';

export const ResidentAllocationPage: React.FC = () => {
  const { user } = useAuth();
  const [showRoomChangeModal, setShowRoomChangeModal] = useState(false);
  const [requestedRoom, setRequestedRoom] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [submittingChange, setSubmittingChange] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);

  const hasAllocation = Boolean(user?.roomNumber && user.roomNumber.trim().length > 0);

  const handleRoomChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setChangeError(null);

    if (!requestedRoom.trim()) {
      setChangeError('Please specify preferred room number or floor.');
      return;
    }
    if (!changeReason.trim()) {
      setChangeError('Please explain the reason for the room transfer request.');
      return;
    }

    setSubmittingChange(true);
    try {
      await createRoomChangeRequest({
        residentId: user.uid,
        residentName: user.name,
        studentEmail: user.email,
        currentRoom: user.roomNumber || 'Unassigned',
        currentBlock: user.block || 'Block A',
        currentBed: user.bedNumber || 'Unassigned',
        requestedRoom: requestedRoom.trim(),
        preferredBlock: user.block || 'Block A',
        reason: changeReason.trim()
      });

      setChangeSuccess(true);
      setTimeout(() => {
        setChangeSuccess(false);
        setShowRoomChangeModal(false);
        setRequestedRoom('');
        setChangeReason('');
      }, 2500);
    } catch (err: any) {
      setChangeError(err.message || 'Failed to submit room change request.');
    } finally {
      setSubmittingChange(false);
    }
  };

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'My Hostel', href: '/resident/room' },
        { label: 'My Allocation Slip' }
      ]}
    >
      {/* Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: hasAllocation ? 'var(--brand-blue)' : '#d97706',
                background: hasAllocation ? 'var(--brand-blue-subtle)' : '#fffbeb',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FileText size={14} /> {hasAllocation ? 'Official Allotment' : 'Application In Progress'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Room Allocation Certificate
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Authorized campus hostel residency certificate and bed allocation receipt.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {hasAllocation && (
            <>
              <button
                onClick={() => setShowRoomChangeModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.84rem' }}
              >
                Request Room Change
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-primary btn-sm"
                style={{ background: '#1e3a8a', borderColor: '#1e3a8a' }}
              >
                <Printer size={15} />
                <span>Print Certificate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!hasAllocation ? (
        /* Pending Allocation State */
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto 40px auto',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px dashed #cbd5e1',
            padding: '48px 32px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}
          >
            <Clock size={32} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
            Room Allocation Pending
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            Welcome, <strong>{user?.name}</strong>! Your registration profile has been recorded in the central roster for <strong>{user?.hostel || 'Aravali Boys Hostel'}</strong>. The Chief Warden desk assigns rooms sequentially based on floor vacancies.
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '420px',
              margin: '0 auto 24px auto',
              textAlign: 'left',
              fontSize: '0.825rem',
              color: '#334155'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Application Ref:</span>
              <strong>APP-{user?.uid?.slice(0, 8).toUpperCase() || 'HOSTEL-2026'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Preferred Hostel:</span>
              <strong>{user?.hostel || 'Aravali Boys Hostel'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Status:</span>
              <strong style={{ color: '#d97706' }}>Awaiting Warden Bed Assignment</strong>
            </div>
          </div>

          <button
            onClick={() => setShowRoomChangeModal(true)}
            className="btn btn-outline"
            style={{ borderColor: '#0284c7', color: '#0284c7' }}
          >
            Submit Specific Room Preference
          </button>
        </div>
      ) : (
        /* Official Certificate Card */
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto 40px auto',
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative'
          }}
        >
          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '24px', marginBottom: '28px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                background: 'var(--brand-purple)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--neutral-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Office of Campus Residence &amp; Mess Administration
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--neutral-dark)', margin: '4px 0' }}>
              Hostel Bed Allotment Slip
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>
              ● Status: Officially Allotted &amp; Verified
            </div>
          </div>

          {/* Certificate Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Resident Full Name
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '2px' }}>
                {user?.name}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Student Email ID
              </span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--neutral-dark)', marginTop: '2px' }}>
                {user?.email}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Hostel Wing
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neutral-dark)', marginTop: '2px' }}>
                {user?.hostel || 'Aravali Boys Hostel'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Building Block
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neutral-dark)', marginTop: '2px' }}>
                {user?.block || 'Block A'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Allotted Room Number
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--brand-blue)', marginTop: '2px' }}>
                Room {user?.roomNumber}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Assigned Bed Identifier
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--brand-blue)', marginTop: '2px' }}>
                {user?.bedNumber || 'Bed 1'}
              </div>
            </div>
          </div>

          {/* Certificate Footer Stamp */}
          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>Digital Verification Reference:</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)' }}>
                SH-RES-{user?.uid?.slice(0, 8).toUpperCase() || 'DEMO-2026'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--neutral-dark)' }}>
                Chief Warden Office
              </div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                Verified Electronic Seal ✓
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Change Request Modal */}
      {showRoomChangeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Hostel Room Transfer Request
              </h3>
              <button
                onClick={() => setShowRoomChangeModal(false)}
                style={{ fontSize: '1.4rem', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {changeSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color="#059669" style={{ marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#065f46' }}>
                  Request Submitted Successfully
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Warden administration will review your room transfer application against vacant slots.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRoomChangeSubmit}>
                {changeError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span>{changeError}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Current Room</label>
                  <input
                    type="text"
                    disabled
                    value={user?.roomNumber ? `Room ${user.roomNumber} (${user.bedNumber || 'Bed 1'})` : 'Unallocated (Pending)'}
                    className="form-input"
                    style={{ background: '#f1f5f9' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Requested Room / Floor Preference *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 205 (Floor 2, Single Bed) or Quiet Corner"
                    className="form-input"
                    value={requestedRoom}
                    onChange={e => setRequestedRoom(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Reason for Room Transfer *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Health conditions requiring lower floor, or seeking quiet study environment."
                    className="form-textarea"
                    value={changeReason}
                    onChange={e => setChangeReason(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowRoomChangeModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingChange}
                    className="btn btn-primary"
                    style={{ background: '#1e3a8a', borderColor: '#1e3a8a' }}
                  >
                    <Send size={15} />
                    <span>{submittingChange ? 'Submitting...' : 'Submit to Warden'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};
